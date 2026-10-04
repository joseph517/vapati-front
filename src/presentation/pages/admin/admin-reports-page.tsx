"use client";

import { adminReportsService } from "@/data/admin/admin-reports.service";
import {
  AdminReportStats,
} from "@/presentation/components/organisms/admin/admin-report-stats";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

export function AdminReportsPage() {
  // Fetched on every visit; the inbox's sort and page do not touch this key.
  const stats = useApiQuery(
    adminReportsService.keys.stats(),
    adminReportsService.stats
  );

  return (
    <>
      <h2 className="mb-6 font-serif text-2xl leading-[1.15] font-medium text-foreground">
        Reportes
      </h2>

      <AdminReportStats
        stats={stats.data}
        loading={stats.loading}
        error={stats.error}
        onRetry={() => stats.reload()}
      />
    </>
  );
}
