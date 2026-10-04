import Link from "next/link";
import type { AdminReportsQuery } from "@/domain/admin/admin-reports-query";
import type { ReportDTO } from "@/domain/reports/report.types";
import { ReportStatusBadge } from "@/presentation/components/atoms/report-status-badge";
import {
  ACTION_TAKEN_LABELS,
  DELETED_ACCOUNT_TEXT,
  reportedEntityTitle,
} from "@/presentation/utils/admin-report-texts";
import { adminReportDetailHref } from "@/presentation/utils/admin-routes";
import { cn } from "@/presentation/utils/cn";
import { formatDateTime } from "@/presentation/utils/format";
import { REPORT_REASON_LABELS } from "@/presentation/utils/report-texts";

// Shared by the header, the rows and the skeleton so the columns line up.
// Fecha, Reportado, Motivo, Estado, Reportó, Acción tomada
export const ADMIN_REPORTS_GRID =
  "grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.15fr)_118px_minmax(0,1fr)_minmax(0,1.35fr)] gap-4";

// The whole row is a link: Enter, middle click and "open in new tab" work without extra code.
// Wide screens get the 6-column grid, narrow ones a card.
export function AdminReportRow({
  report,
  query,
}: {
  report: ReportDTO;
  query: AdminReportsQuery;
}) {
  const date = formatDateTime(report.createdAt);
  const entity = reportedEntityTitle(
    report.reportedEntityType,
    report.reportedEntityId
  );
  const reason = REPORT_REASON_LABELS[report.reason];
  const reporter =
    report.reporterUsername === null
      ? DELETED_ACCOUNT_TEXT
      : `@${report.reporterUsername}`;
  const action = report.actionTaken ? ACTION_TAKEN_LABELS[report.actionTaken] : "";

  return (
    <Link
      href={adminReportDetailHref(report.id, query)}
      className="block border-t border-[var(--divider)] px-5 py-4 transition-colors first:border-t-0 hover:bg-[var(--track-soft)] focus-visible:bg-[var(--track-soft)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      <div className={`hidden items-center min-[820px]:grid ${ADMIN_REPORTS_GRID}`}>
        <span className="truncate text-[13px] text-[var(--ink-body)]">{date}</span>
        <span className="truncate text-sm font-medium text-foreground">
          {entity}
        </span>
        <span className="truncate text-[13px] text-[var(--ink-body)]">{reason}</span>
        <span>
          <ReportStatusBadge status={report.status} />
        </span>
        <span
          className={cn(
            "truncate text-[13px]",
            report.reporterUsername === null
              ? "text-[var(--ink-faint)]"
              : "text-[var(--ink-body)]"
          )}
        >
          {reporter}
        </span>
        <span title={action} className="truncate text-[13px] text-[var(--ink-body)]">
          {action}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 min-[820px]:hidden">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[15px] font-medium text-foreground">{entity}</p>
          <ReportStatusBadge status={report.status} />
        </div>
        <p className="text-[13px] text-[var(--ink-body)]">{reason}</p>
        <p className="text-[13px] break-all text-muted-foreground">
          {reporter} · {date}
        </p>
        {action && (
          <p className="text-[13px] text-[var(--ink-faint)]">{action}</p>
        )}
      </div>
    </Link>
  );
}
