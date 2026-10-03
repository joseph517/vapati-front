import { CategoryPill } from "@/components/category-pill";
import type { CategoryDTO } from "@/domain/categories/category.types";

const MAX_VISIBLE = 3;

export function CategoryChips({ categories }: { categories: CategoryDTO[] }) {
  if (categories.length === 0) return null;

  const visible = categories.slice(0, MAX_VISIBLE);
  const extraCount = categories.length - visible.length;

  return (
    <div className="flex flex-wrap gap-2">
      {visible.map((category) => (
        <CategoryPill key={category.id}>{category.name}</CategoryPill>
      ))}
      {extraCount > 0 && (
        <CategoryPill>+{extraCount}</CategoryPill>
      )}
    </div>
  );
}
