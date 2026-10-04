import Link from "next/link";
import type { ReportDTO } from "@/domain/reports/report.types";
import { ReportField } from "@/presentation/components/molecules/admin/report-field";
import {
  DELETED_ACCOUNT_TEXT,
  NO_DESCRIPTION_TEXT,
  PUBLICATION_NOT_VIEWABLE_TEXT,
  reportedEntityTitle,
} from "@/presentation/utils/admin-report-texts";
import { REPORT_REASON_LABELS } from "@/presentation/utils/report-texts";

const LINK_CLASS =
  "w-fit text-[13.5px] font-medium text-primary underline hover:text-[var(--accent-hover)]";

// Publications have no page of their own, so they get a note instead of a link
function ReportedEntityLink({ report }: { report: ReportDTO }) {
  const id = report.reportedEntityId;
  switch (report.reportedEntityType) {
    case "USER":
      return (
        <Link href={`/admin/users/${id}`} className={LINK_CLASS}>
          Ver usuario
        </Link>
      );
    case "CAMPAIGN":
      return (
        <Link href={`/campaigns/${id}`} className={LINK_CLASS}>
          Ver campaña
        </Link>
      );
    case "PUBLICATION":
      return (
        <span className="text-[12.5px] text-[var(--ink-faint)]">
          {PUBLICATION_NOT_VIEWABLE_TEXT}
        </span>
      );
  }
}

export function ReportSummaryCard({ report }: { report: ReportDTO }) {
  return (
    <section className="mt-[30px] rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-[18px]">
        <ReportField label="Lo reportado">
          <span className="text-[15px] text-foreground">
            {reportedEntityTitle(
              report.reportedEntityType,
              report.reportedEntityId
            )}
          </span>
          <ReportedEntityLink report={report} />
        </ReportField>
        <ReportField label="Motivo">
          <span className="text-[15px] text-foreground">
            {REPORT_REASON_LABELS[report.reason]}
          </span>
        </ReportField>
        <ReportField label="Quién reportó" className="min-w-0">
          {report.reporterId === null ? (
            <span className="text-[15px] text-[var(--ink-faint)]">
              {DELETED_ACCOUNT_TEXT}
            </span>
          ) : (
            <>
              <span className="text-[15px] break-all text-foreground">
                @{report.reporterUsername}
              </span>
              <span className="text-[13.5px] [overflow-wrap:anywhere] text-muted-foreground">
                {report.reporterEmail}
              </span>
              <Link
                href={`/admin/users/${report.reporterId}`}
                className={LINK_CLASS}
              >
                Ver usuario
              </Link>
            </>
          )}
        </ReportField>
      </div>

      <div className="mt-[22px] border-t border-[var(--divider)] pt-[22px]">
        <h3 className="mb-2.5 text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
          Descripción
        </h3>
        {report.description ? (
          <p className="max-w-[62ch] text-base leading-[1.65] text-pretty whitespace-pre-wrap [overflow-wrap:anywhere] text-[var(--ink-body)]">
            {report.description}
          </p>
        ) : (
          <p className="text-[15px] text-[var(--ink-faint)]">
            {NO_DESCRIPTION_TEXT}
          </p>
        )}
      </div>
    </section>
  );
}
