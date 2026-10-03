import type { CategoryDTO } from "@/domain/categories/category.types";
import {
  getInterestsHint,
  MAX_INTERESTS,
} from "@/domain/users/user-validation";
import {
  CategorySelectChips,
} from "@/presentation/components/molecules/categories/category-select-chips";
import { Skeleton } from "@/presentation/components/ui/skeleton";

interface InterestsPickerProps {
  categories: CategoryDTO[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  selectedIds: number[];
  onToggle: (categoryId: number) => void;
}

// Shared by register and edit profile. Receives the categories already loaded.
export function InterestsPicker({
  categories,
  loading,
  error,
  onRetry,
  selectedIds,
  onToggle,
}: InterestsPickerProps) {
  return (
    <div>
      {loading && (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[35px] w-24 rounded-full" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2.5 text-[13.5px] text-destructive">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="shrink-0 rounded-md border border-[var(--accent-soft-border)] bg-white px-2.5 py-1 text-[13px] font-medium text-destructive"
          >
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <CategorySelectChips
          categories={categories}
          selectedIds={selectedIds}
          onToggle={onToggle}
          maxSelected={MAX_INTERESTS}
        />
      )}

      <p className="mt-1.5 text-[12.5px] text-[var(--ink-faint)]">
        {getInterestsHint(selectedIds.length)}
      </p>
    </div>
  );
}
