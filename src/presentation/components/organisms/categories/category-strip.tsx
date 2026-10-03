import { useRef } from "react";
import type { CategoryDTO } from "@/domain/categories/category.types";
import {
  CategoryScrollButton,
} from "@/presentation/components/atoms/category-scroll-button";
import {
  CategoryStripItem,
} from "@/presentation/components/molecules/categories/category-strip-item";
import { Skeleton } from "@/presentation/components/ui/skeleton";

const SCROLL_DISTANCE = 280;

export function CategoryStrip({
  categories,
  loading,
  error,
  activeId,
  onToggle,
}: {
  categories: CategoryDTO[];
  loading: boolean;
  error: string | null;
  activeId: number | null;
  onToggle: (categoryId: number) => void;
}) {
  const stripRef = useRef<HTMLDivElement>(null);

  function scroll(direction: 1 | -1) {
    stripRef.current?.scrollBy({
      left: direction * SCROLL_DISTANCE,
      behavior: "smooth",
    });
  }

  return (
    <div className="flex items-center justify-center gap-2.5">
      <CategoryScrollButton direction="left" onClick={() => scroll(-1)} />
      <div
        ref={stripRef}
        className="flex max-w-full gap-0.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[68px] w-[92px] shrink-0 rounded-[10px]" />
          ))}

        {!loading && error && (
          <span className="px-2 py-2 text-[13px] text-destructive">{error}</span>
        )}

        {!loading &&
          !error &&
          categories.map((category, index) => (
            <CategoryStripItem
              key={category.id}
              category={category}
              index={index}
              active={activeId === category.id}
              onToggle={onToggle}
            />
          ))}
      </div>
      <CategoryScrollButton direction="right" onClick={() => scroll(1)} />
    </div>
  );
}
