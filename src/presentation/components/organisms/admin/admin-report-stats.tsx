import type { ReportStatsDTO } from "@/domain/reports/report.types";
import { REPORT_REASONS } from "@/domain/reports/reports";
import type { QueryError } from "@/domain/shared/errors";
import {
  ReportBreakdownCard,
} from "@/presentation/components/molecules/admin/report-breakdown-card";
import {
  ReportStatCard,
} from "@/presentation/components/molecules/admin/report-stat-card";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import {
  AdminReportStatsSkeleton,
  REPORT_BREAKDOWN_GRID,
  REPORT_STAT_CARDS_GRID,
} from "@/presentation/components/organisms/admin/admin-report-stats-skeleton";
import { REPORTED_ENTITY_LABELS } from "@/presentation/utils/admin-report-texts";
import { REPORT_REASON_LABELS } from "@/presentation/utils/report-texts";

const ENTITY_TYPES = ["USER", "PUBLICATION", "CAMPAIGN"] as const;

// The container fetches the stats; this only renders their three states.
export function AdminReportStats({
  stats,
  loading,
  error,
  onRetry,
}: {
  stats: ReportStatsDTO | null;
  loading: boolean;
  error: QueryError | null;
  onRetry: () => void;
}) {
  let content;
  if (loading) {
    content = <AdminReportStatsSkeleton />;
  } else if (error || !stats) {
    content = (
      <ErrorCard
        title="No pudimos cargar las estadísticas"
        message={error?.message ?? ""}
        actionLabel="Reintentar"
        onAction={onRetry}
      />
    );
  } else {
    content = (
      <>
        <div className={REPORT_STAT_CARDS_GRID}>
          <ReportStatCard
            label="Pendientes"
            value={stats.pendingReports}
            variant="highlight"
          />
          <ReportStatCard
            label="En revisión"
            value={stats.reportsByStatus.UNDER_REVIEW}
          />
          <ReportStatCard label="Resueltos" value={stats.resolvedReports} />
          <ReportStatCard label="Rechazados" value={stats.rejectedReports} />
          <ReportStatCard
            label="Total"
            value={stats.totalReports}
            variant="total"
          />
        </div>
        <div className={REPORT_BREAKDOWN_GRID}>
          <ReportBreakdownCard
            title="Por motivo"
            rows={REPORT_REASONS.map((reason) => ({
              key: reason,
              label: REPORT_REASON_LABELS[reason],
              count: stats.reportsByReason[reason] ?? 0,
            }))}
          />
          <ReportBreakdownCard
            title="Por tipo de lo reportado"
            rows={ENTITY_TYPES.map((type) => ({
              key: type,
              label: REPORTED_ENTITY_LABELS[type],
              count: stats.reportsByEntityType[type] ?? 0,
            }))}
          />
        </div>
      </>
    );
  }

  return <section aria-label="Estadísticas de reportes">{content}</section>;
}
