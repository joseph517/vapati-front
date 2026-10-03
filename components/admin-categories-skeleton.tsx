import { ADMIN_CATEGORY_LIST_CLASS } from "@/components/admin-category-list";
import { ADMIN_CATEGORY_ROW_CLASS } from "@/components/admin-category-row";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_ROWS = 10;

// Placeholder rows: name, description, "Editar" and "Borrar".
export function AdminCategoriesSkeleton() {
  return (
    <div className={ADMIN_CATEGORY_LIST_CLASS}>
      {Array.from({ length: SKELETON_ROWS }).map((_, index) => (
        <div
          key={index}
          className={`${ADMIN_CATEGORY_ROW_CLASS} flex items-start justify-between gap-4`}
        >
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>
          <div className="flex shrink-0 gap-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-7 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
