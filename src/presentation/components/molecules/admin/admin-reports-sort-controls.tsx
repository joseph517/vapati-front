import type { AdminReportsQuery } from "@/domain/admin/admin-reports-query";
import { ChipRadioGroup } from "@/presentation/components/molecules/chip-radio-group";
import { REPORT_SORT_OPTIONS } from "@/presentation/utils/admin-report-texts";

// Each chip is a sortBy + sortDirection pair, so the chip value joins both
const SORT_CHIPS = REPORT_SORT_OPTIONS.map((option) => ({
  value: `${option.sortBy}:${option.sortDirection}`,
  label: option.label,
}));

// A sort change always goes back to the first page.
export function AdminReportsSortControls({
  query,
  onChange,
}: {
  query: AdminReportsQuery;
  onChange: (query: AdminReportsQuery) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-[13px] text-[var(--ink-label)]">Ordenar</span>
      <ChipRadioGroup
        label="Orden de la bandeja"
        options={SORT_CHIPS}
        value={`${query.sortBy}:${query.sortDirection}`}
        onChange={(value) => {
          const option = REPORT_SORT_OPTIONS.find(
            (o) => `${o.sortBy}:${o.sortDirection}` === value
          );
          if (option) {
            onChange({
              page: 0,
              sortBy: option.sortBy,
              sortDirection: option.sortDirection,
            });
          }
        }}
      />
    </div>
  );
}
