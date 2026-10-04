import type { AdminUsersQuery } from "@/domain/admin/admin-users-query";
import type { AdminUserSortBy } from "@/domain/admin/admin.types";
import type { SortDirection } from "@/domain/shared/shared.types";
import {
  ChipRadioGroup,
  type ChipOption,
} from "@/presentation/components/molecules/chip-radio-group";

const SORT_BY_OPTIONS: ChipOption<AdminUserSortBy>[] = [
  { value: "id", label: "ID" },
  { value: "createdAt", label: "Fecha de alta" },
];

const SORT_DIRECTION_OPTIONS: ChipOption<SortDirection>[] = [
  { value: "asc", label: "Ascendente" },
  { value: "desc", label: "Descendente" },
];

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
