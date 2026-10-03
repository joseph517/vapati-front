import type { CategoryDTO } from "@/domain/categories/category.types";
import {
  DangerOutlineButton,
} from "@/presentation/components/atoms/danger-outline-button";
import { Button } from "@/presentation/components/ui/button";

// Shared by the rows, the edit form and the skeleton so the spacing lines up.
export const ADMIN_CATEGORY_ROW_CLASS =
  "border-t border-[var(--divider)] px-5 py-4 first:border-t-0";

// Read mode: name, description or "Sin descripción", "Editar" and "Borrar".
export function AdminCategoryRow({
  category,
  onEdit,
  onDelete,
  editDisabled,
}: {
  category: CategoryDTO;
  onEdit: () => void;
  onDelete: () => void;
  editDisabled: boolean; // while another row is saving
}) {
  return (
    <div
      className={`${ADMIN_CATEGORY_ROW_CLASS} flex flex-wrap items-start justify-between gap-x-4 gap-y-3`}
    >
      <div className="min-w-0 flex-1 basis-[200px]">
        <p className="text-[15px] font-medium break-words text-foreground">
          {category.name}
        </p>
        {category.description ? (
          <p className="mt-0.5 text-[13.5px] break-words text-[var(--ink-body)]">
            {category.description}
          </p>
        ) : (
          <p className="mt-0.5 text-[13.5px] text-[var(--ink-faint)]">
            Sin descripción
          </p>
        )}
      </div>
      <div className="flex shrink-0 gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={editDisabled}
          onClick={onEdit}
        >
          Editar
        </Button>
        <DangerOutlineButton type="button" onClick={onDelete}>
          Borrar
        </DangerOutlineButton>
      </div>
    </div>
  );
}
