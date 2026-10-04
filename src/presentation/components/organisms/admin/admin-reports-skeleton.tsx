import { ADMIN_REPORTS_PAGE_SIZE } from "@/domain/admin/admin-reports-query";
import {
  ADMIN_REPORTS_GRID,
} from "@/presentation/components/molecules/admin/admin-report-row";
import { Skeleton } from "@/presentation/components/ui/skeleton";

// One full page of placeholder rows, in both the wide and the narrow variant.
// The caller provides the container.
export function AdminReportsSkeleton() {
  return (
    <>
      {Array.from({ length: ADMIN_REPORTS_PAGE_SIZE }).map((_, index) => (
        <div
          key={index}
          className="border-t border-[var(--divider)] px-5 py-4 first:border-t-0"
        >
          <div className={`hidden items-center min-[820px]:grid ${ADMIN_REPORTS_GRID}`}>
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-3.5 w-[65%]" />
            <Skeleton className="h-5 w-[84px] rounded-full" />
            <Skeleton className="h-3.5 w-3/5" />
            <Skeleton className="h-3.5 w-1/2" />
          </div>
          <div className="flex flex-col gap-2 min-[820px]:hidden">
            <div className="flex justify-between gap-3">
              <Skeleton className="h-4 w-[140px]" />
              <Skeleton className="h-5 w-[84px] rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-[110px]" />
            <Skeleton className="h-3.5 w-[200px] max-w-full" />
          </div>
        </div>
      ))}
    </>
  );
}
