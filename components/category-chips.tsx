import type { CategoryDTO } from "@/lib/types";

const MAX_VISIBLE = 3;

export function CategoryChips({ categories }: { categories: CategoryDTO[] }) {
  if (categories.length === 0) return null;

  const visible = categories.slice(0, MAX_VISIBLE);
  const extraCount = categories.length - visible.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((category) => (
        <span
          key={category.id}
          className="rounded-full border border-input bg-white px-3.5 py-2 text-[13px] font-medium text-muted-foreground"
        >
          {category.name}
        </span>
      ))}
      {extraCount > 0 && (
        <span className="rounded-full border border-input bg-white px-3.5 py-2 text-[13px] font-medium text-muted-foreground">
          +{extraCount}
        </span>
      )}
    </div>
  );
}
