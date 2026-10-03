import { ADMIN_USERS_PAGE_SIZE } from "@/domain/admin/admin-users-query";
import {
  ADMIN_USERS_GRID,
} from "@/presentation/components/molecules/admin/admin-user-row";
import { Skeleton } from "@/presentation/components/ui/skeleton";

// One full page of placeholder rows, in both the wide and the narrow variant.
// The caller provides the container.
export function AdminUsersSkeleton() {
  return (
    <>
      {Array.from({ length: ADMIN_USERS_PAGE_SIZE }).map((_, index) => (
        <div
          key={index}
          className="border-t border-[var(--divider)] px-5 py-4 first:border-t-0"
        >
          <div className={`hidden items-center min-[820px]:grid ${ADMIN_USERS_GRID}`}>
            <Skeleton className="h-5 w-10" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-3.5 w-5/6" />
            <Skeleton className="h-3.5 w-2/3" />
            <Skeleton className="h-4 w-1/2 rounded-full" />
          </div>
          <div className="flex flex-col gap-2 min-[820px]:hidden">
            <div className="flex justify-between gap-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-5 w-14" />
            </div>
            <Skeleton className="h-3.5 w-24" />
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>
      ))}
    </>
  );
}
