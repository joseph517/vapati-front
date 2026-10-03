import type { ReactNode } from "react";
import { AdminCategoryRow } from "@/components/admin-category-row";
import type { CategoryDTO } from "@/lib/types";

// Shared with the skeleton, which renders its own container.
export const ADMIN_CATEGORY_LIST_CLASS =
  "overflow-hidden rounded-xl border border-border bg-card";

// Categories arrive already sorted by name. At most one row is in edit mode,
// rendered by the caller through `renderEditForm`.
export function AdminCategoryList({
  categories,
  editingId,
  editDisabled,
  onEdit,
  renderEditForm,
}: {
  categories: CategoryDTO[];
  editingId: number | null;
  editDisabled: boolean;
  onEdit: (category: CategoryDTO) => void;
  renderEditForm: (category: CategoryDTO) => ReactNode;
}) {
  return (
    <div className={ADMIN_CATEGORY_LIST_CLASS}>
      {categories.map((category) =>
        category.id === editingId ? (
          renderEditForm(category)
        ) : (
          <AdminCategoryRow
            key={category.id}
            category={category}
            onEdit={() => onEdit(category)}
            editDisabled={editDisabled}
          />
        )
      )}
    </div>
  );
}
