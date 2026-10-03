import { CategoryMark } from "@/components/category-mark";
import type { CategoryDTO } from "@/domain/categories/category.types";

export function CategoryStripItem({
  category,
  index,
  active,
  onToggle,
}: {
  category: CategoryDTO;
  index: number;
  active: boolean;
  onToggle: (categoryId: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(category.id)}
      className="flex w-[92px] shrink-0 flex-col items-center gap-[9px] rounded-[10px] px-1 py-2 hover:bg-[var(--secondary)]"
    >
      <CategoryMark index={index} active={active} />
      <span
        className="text-center text-[12.5px] leading-[1.25] font-medium text-wrap-pretty"
        style={{ color: active ? "#8C4A2F" : "#6E6258" }}
      >
        {category.name}
      </span>
    </button>
  );
}
