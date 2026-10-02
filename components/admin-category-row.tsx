import { Button } from "@/components/ui/button";
import { DangerOutlineButton } from "@/components/danger-outline-button";
import type { CategoryDTO } from "@/lib/types";

// Shared by the rows, the edit form and the skeleton so the spacing lines up.
export const ADMIN_CATEGORY_ROW_CLASS =
  "border-t border-[var(--divider)] px-5 py-4 first:border-t-0";

// Read mode: name, description or "Sin descripción", "Editar" and "Borrar".
export function AdminCategoryRow({ category }: { category: CategoryDTO }) {
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
        <Button type="button" variant="outline" size="sm">
          Editar
        </Button>
        <DangerOutlineButton type="button">Borrar</DangerOutlineButton>
      </div>
    </div>
  );
}
