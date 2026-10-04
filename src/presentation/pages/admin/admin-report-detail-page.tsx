"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { adminReportsService } from "@/data/admin/admin-reports.service";
import { isReportNotFound } from "@/domain/admin/admin-reports";
import { UNEXPECTED_ERROR_MESSAGE } from "@/domain/shared/errors";
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
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";
import { adminReportsBackHref } from "@/presentation/utils/admin-routes";
import { formatDateTime } from "@/presentation/utils/format";

export function AdminReportDetailPage() {
  const params = useParams<{ reportId: string }>();
  const searchParams = useSearchParams();
  const backHref = adminReportsBackHref(searchParams.get("from"));

  // The route's id goes as is: a non-numeric one answers 400, shown as not found.
  const { data: report, loading, error, reload } = useApiQuery(
    adminReportsService.keys.detail(params.reportId),
    () => adminReportsService.detail(params.reportId)
  );

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
        <ReportSummaryCard report={report} />
        <ReportReviewSummaryCard report={report} />
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
