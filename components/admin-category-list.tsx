import { AdminCategoryRow } from "@/components/admin-category-row";
import type { CategoryDTO } from "@/lib/types";

// Shared with the skeleton, which renders its own container.
export const ADMIN_CATEGORY_LIST_CLASS =
  "overflow-hidden rounded-xl border border-border bg-card";

// Categories arrive already sorted by name.
export function AdminCategoryList({ categories }: { categories: CategoryDTO[] }) {
  return (
    <div className={ADMIN_CATEGORY_LIST_CLASS}>
      {categories.map((category) => (
        <AdminCategoryRow key={category.id} category={category} />
      ))}
    </div>
  );
}
