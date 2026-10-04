import type { AdminReportsQuery } from "@/domain/admin/admin-reports-query";
import type { ReportDTO } from "@/domain/reports/report.types";
import {
  ADMIN_REPORTS_GRID,
  AdminReportRow,
} from "@/presentation/components/molecules/admin/admin-report-row";
import {
  AdminReportsSkeleton,
} from "@/presentation/components/organisms/admin/admin-reports-skeleton";

const COLUMNS = ["Fecha", "Reportado", "Motivo", "Estado", "Reportó", "Acción tomada"];

// Column headers only on wide screens: the narrow cards carry their own layout.
export function AdminReportsTable({
  reports,
  query,
  loading,
}: {
  reports: ReportDTO[];
  query: AdminReportsQuery;
  loading: boolean;
}) {
  return (
    <div
      aria-busy={loading || undefined}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div
        className={`hidden border-b border-border bg-[var(--track-soft)] px-5 py-2.5 min-[820px]:grid ${ADMIN_REPORTS_GRID}`}
      >
        {COLUMNS.map((column) => (
          <span
            key={column}
            className="text-[11.5px] font-semibold tracking-[0.06em] text-[var(--ink-eyebrow)] uppercase"
          >
            {column}
          </span>
        ))}
      </div>
      {loading ? (
        <AdminReportsSkeleton />
      ) : (
        reports.map((report) => (
          <AdminReportRow key={report.id} report={report} query={query} />
        ))
      )}
    </div>
  );
}
