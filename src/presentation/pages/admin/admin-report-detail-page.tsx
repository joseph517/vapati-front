"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { adminReportsService } from "@/data/admin/admin-reports.service";
import { canReview, isReportNotFound } from "@/domain/admin/admin-reports";
import type { ReportDTO } from "@/domain/reports/report.types";
import { UNEXPECTED_ERROR_MESSAGE } from "@/domain/shared/errors";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import { ReportStatusBadge } from "@/presentation/components/atoms/report-status-badge";
import {
  ReportReviewSummaryCard,
} from "@/presentation/components/molecules/admin/report-review-summary-card";
import {
  ReportSummaryCard,
} from "@/presentation/components/molecules/admin/report-summary-card";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import {
  AdminReportDetailSkeleton,
} from "@/presentation/components/organisms/admin/admin-report-detail-skeleton";
import {
  ReportReviewForm,
} from "@/presentation/components/organisms/admin/report-review-form";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";
import { REVIEW_SAVED_NOTICE } from "@/presentation/utils/admin-report-texts";
import { adminReportsBackHref } from "@/presentation/utils/admin-routes";
import { formatDateTime } from "@/presentation/utils/format";

export function AdminReportDetailPage() {
  const params = useParams<{ reportId: string }>();
  const searchParams = useSearchParams();
  const backHref = adminReportsBackHref(searchParams.get("from"));

  // The route's id goes as is: a non-numeric one answers 400, shown as not found.
  const { data, loading, error, reload } = useApiQuery(
    adminReportsService.keys.detail(params.reportId),
    () => adminReportsService.detail(params.reportId)
  );

  // The PUT response replaces the fetched report while it belongs to this route.
  const [savedReport, setSavedReport] = useState<ReportDTO | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const report =
    savedReport !== null && String(savedReport.id) === params.reportId
      ? savedReport
      : data;

  function handleSaved(saved: ReportDTO) {
    setSavedReport(saved);
    setNotice(REVIEW_SAVED_NOTICE);
    setConflict(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Someone else already resolved or rejected it: show the final state.
  function handleConflict(message: string) {
    setConflict(message);
    setNotice(null);
    setSavedReport(null);
    reload();
  }

  function handleSubmitAttempt() {
    setNotice(null);
    setConflict(null);
  }

  let content: React.ReactNode;
  if (loading) {
    content = <AdminReportDetailSkeleton />;
  } else if (error && isReportNotFound(error.status)) {
    content = (
      <ErrorCard
        message="No encontramos este reporte."
        actionLabel="Volver a Reportes"
        actionHref={backHref}
      />
    );
  } else if (error || !report) {
    content = (
      <ErrorCard
        title="No pudimos cargar este reporte"
        message={error?.message ?? UNEXPECTED_ERROR_MESSAGE}
        actionLabel="Reintentar"
        onAction={() => reload()}
      />
    );
  } else {
    content = (
      <>
        <div>
          <h2 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
            Reporte #{report.id}
          </h2>
          <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
            <ReportStatusBadge status={report.status} />
            <span className="text-sm text-muted-foreground">
              Creado el {formatDateTime(report.createdAt)}
            </span>
          </div>
        </div>
        {notice && (
          <NoticeAlert
            role="status"
            className="mt-[22px]"
            onDismiss={() => setNotice(null)}
          >
            {notice}
          </NoticeAlert>
        )}
        {conflict && (
          <NoticeAlert
            tone="danger"
            className="mt-[22px]"
            onDismiss={() => setConflict(null)}
          >
            {conflict}
          </NoticeAlert>
        )}
        <ReportSummaryCard report={report} />
        <ReportReviewSummaryCard report={report} />
        {canReview(report.status) && (
          <ReportReviewForm
            key={report.reviewedAt ?? "unreviewed"}
            report={report}
            onSaved={handleSaved}
            onConflict={handleConflict}
            onSubmitAttempt={handleSubmitAttempt}
          />
        )}
      </>
    );
  }

  return (
    <div className="max-w-[760px]">
      <Link
        href={backHref}
        className="mb-6 block w-fit text-[13.5px] text-muted-foreground hover:text-foreground"
      >
        ← Volver a Reportes
      </Link>
      {content}
    </div>
  );
}
