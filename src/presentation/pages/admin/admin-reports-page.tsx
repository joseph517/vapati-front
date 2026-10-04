"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { adminReportsService } from "@/data/admin/admin-reports.service";
import {
  parseAdminReportsQuery,
  type AdminReportsQuery,
} from "@/domain/admin/admin-reports-query";
import {
  AdminReportsSortControls,
} from "@/presentation/components/molecules/admin/admin-reports-sort-controls";
import { EmptyState } from "@/presentation/components/molecules/empty-state";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import {
  PaginationControls,
} from "@/presentation/components/molecules/pagination-controls";
import {
  AdminReportStats,
} from "@/presentation/components/organisms/admin/admin-report-stats";
import {
  AdminReportsTable,
} from "@/presentation/components/organisms/admin/admin-reports-table";
import { Button } from "@/presentation/components/ui/button";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";
import { adminReportsHref } from "@/presentation/utils/admin-routes";

export function AdminReportsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseAdminReportsQuery(searchParams);

  // Fetched on every visit; the inbox's sort and page do not touch this key.
  const stats = useApiQuery(
    adminReportsService.keys.stats(),
    adminReportsService.stats
  );

  // A non-admin gets 403 here: the layout's guard is UI-only.
  const { data, loading, error, reload } = useApiQuery(
    adminReportsService.keys.paginated(query),
    () => adminReportsService.listPaginated(query)
  );

  const goTo = (next: AdminReportsQuery) => router.push(adminReportsHref(next));

  const reports = data?.content ?? [];

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

      <div className="mt-[34px] mb-4 flex flex-wrap items-center justify-between gap-4">
        <h3 className="font-serif text-lg leading-[1.2] font-medium text-foreground">
          Bandeja
        </h3>
        <AdminReportsSortControls query={query} onChange={goTo} />
      </div>

      {loading && <AdminReportsTable reports={[]} query={query} loading />}

      {!loading && error && (
        <ErrorCard
          title="No pudimos cargar los reportes"
          message={error.message}
          actionLabel="Reintentar"
          onAction={() => reload()}
        />
      )}

      {!loading && !error && data && data.totalElements === 0 && (
        <EmptyState title="Todavía no hay reportes." />
      )}

      {!loading &&
        !error &&
        data &&
        reports.length === 0 &&
        data.totalElements > 0 && (
        <EmptyState
          title="Esta página no tiene reportes."
          action={
            <Button asChild variant="outline" className="mt-2">
              <Link href={adminReportsHref({ ...query, page: 0 })}>
                Ir a la primera página
              </Link>
            </Button>
          }
        />
      )}

      {!loading && !error && data && reports.length > 0 && (
        <>
          <AdminReportsTable reports={reports} query={query} loading={false} />
          <PaginationControls
            page={data.number}
            totalPages={Math.max(1, data.totalPages)}
            onChange={(page) => goTo({ ...query, page })}
          />
        </>
      )}
    </>
  );
}
