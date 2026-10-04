import type { ReportStatus } from "@/domain/reports/report.types";
import { REPORT_STATUS_META } from "@/presentation/utils/admin-report-texts";

// Same pill as StatusBadge, with the report statuses
export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const meta = REPORT_STATUS_META[status];
  return (
    <span
      className="inline-flex w-fit items-center rounded-full px-[9px] py-[3px] text-[11px] font-semibold tracking-[.06em] whitespace-nowrap uppercase"
      style={{ backgroundColor: meta.bg, color: meta.fg }}
    >
      {meta.label}
    </span>
  );
}
