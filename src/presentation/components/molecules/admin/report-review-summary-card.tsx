import type { ReportDTO } from "@/domain/reports/report.types";
import { ReportField } from "@/presentation/components/molecules/admin/report-field";
import {
  ACTION_TAKEN_LABELS,
  DELETED_ACCOUNT_TEXT,
  NO_ACTION_TEXT,
  NO_NOTES_TEXT,
  UNREVIEWED_TEXT,
} from "@/presentation/utils/admin-report-texts";
import { formatDateTime } from "@/presentation/utils/format";

// The last review only: each review replaces the previous one
export function ReportReviewSummaryCard({ report }: { report: ReportDTO }) {
  return (
    <section className="mt-[18px] rounded-xl border border-border bg-card p-6">
      <h2 className="text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
        Revisión
      </h2>
      {report.reviewedAt === null ? (
        <p className="mt-3 text-sm text-muted-foreground">{UNREVIEWED_TEXT}</p>
      ) : (
        <>
          <div className="mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-[18px]">
            <ReportField label="Revisó" className="min-w-0">
              {report.reviewedById === null ? (
                <span className="text-[15px] text-[var(--ink-faint)]">
                  {DELETED_ACCOUNT_TEXT}
                </span>
              ) : (
                <span className="text-[15px] break-all text-foreground">
                  @{report.reviewedByUsername}
                </span>
              )}
            </ReportField>
            <ReportField label="Cuándo">
              <span className="text-[15px] text-foreground">
                {formatDateTime(report.reviewedAt)}
              </span>
            </ReportField>
            <ReportField label="Acción tomada">
              <span className="text-[15px] text-foreground">
                {report.actionTaken
                  ? ACTION_TAKEN_LABELS[report.actionTaken]
                  : NO_ACTION_TEXT}
              </span>
            </ReportField>
          </div>
          <div className="mt-[22px] border-t border-[var(--divider)] pt-[22px]">
            <h3 className="mb-2.5 text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
              Notas del ADMIN
            </h3>
            {report.adminNotes ? (
              <p className="max-w-[62ch] text-[15px] leading-[1.55] whitespace-pre-wrap [overflow-wrap:anywhere] text-[var(--ink-body)]">
                {report.adminNotes}
              </p>
            ) : (
              <p className="text-[15px] text-[var(--ink-faint)]">
                {NO_NOTES_TEXT}
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
