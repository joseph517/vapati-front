import type { CategoryDTO } from "@/domain/categories/category.types";
import { cn } from "@/presentation/utils/cn";

export function CategorySelectChips({
  categories,
  selectedIds,
  onToggle,
  maxSelected,
}: {
  categories: CategoryDTO[];
  selectedIds: number[];
  onToggle: (categoryId: number) => void;
  maxSelected: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => {
        const active = selectedIds.includes(category.id);
        const disabled = !active && selectedIds.length >= maxSelected;
        return (
          <button
            key={category.id}
            type="button"
            disabled={disabled}
            onClick={() => onToggle(category.id)}
            className={cn(
              "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
              active
                ? "border-[var(--accent-soft-border)] bg-accent text-accent-foreground"
                : "border-input bg-secondary text-muted-foreground",
              disabled && "opacity-45"
            )}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
