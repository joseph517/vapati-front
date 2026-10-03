import type { AdminUsersQuery } from "@/domain/admin/admin-users-query";
import type { AdminUserSortBy } from "@/domain/admin/admin.types";
import type { SortDirection } from "@/domain/shared/shared.types";
import { cn } from "@/presentation/utils/cn";

type Option<T extends string> = { value: T; label: string };

const SORT_BY_OPTIONS: Option<AdminUserSortBy>[] = [
  { value: "id", label: "ID" },
  { value: "createdAt", label: "Fecha de alta" },
];

const SORT_DIRECTION_OPTIONS: Option<SortDirection>[] = [
  { value: "asc", label: "Ascendente" },
  { value: "desc", label: "Descendente" },
];

function ChipRadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex gap-1.5">
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => {
              if (!checked) onChange(option.value);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors",
              checked
                ? "border-[var(--accent-soft-border)] bg-accent text-accent-foreground"
                : "border-input bg-secondary text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

// A sort change always goes back to the first page.
export function AdminUsersSortControls({
  query,
  onChange,
}: {
  query: AdminUsersQuery;
  onChange: (query: AdminUsersQuery) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[13px] text-[var(--ink-label)]">Ordenar por</span>
      <ChipRadioGroup
        label="Campo de orden"
        options={SORT_BY_OPTIONS}
        value={query.sortBy}
        onChange={(sortBy) => onChange({ ...query, page: 0, sortBy })}
      />
      <ChipRadioGroup
        label="Dirección de orden"
        options={SORT_DIRECTION_OPTIONS}
        value={query.sortDirection}
        onChange={(sortDirection) =>
          onChange({ ...query, page: 0, sortDirection })
        }
      />
    </div>
  );
}
