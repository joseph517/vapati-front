import { useId } from "react";
import type { ReportReason } from "@/domain/reports/report.types";
import { REPORT_REASONS } from "@/domain/reports/reports";
import { FieldError } from "@/presentation/components/atoms/field-error";
import { cn } from "@/presentation/utils/cn";
import { FIELD_LABEL_CLASSES } from "@/presentation/utils/form-classes";
import { REPORT_REASON_LABELS } from "@/presentation/utils/report-texts";

// "Motivo" of the report dialog: one chip per reason, single choice.
export function ReportReasonChips({
  value,
  onChange,
  disabled,
  error,
}: {
  value: ReportReason | null;
  onChange: (reason: ReportReason) => void;
  disabled?: boolean;
  error?: string | null;
}) {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <span id={labelId} className={FIELD_LABEL_CLASSES}>
        Motivo
      </span>
      <div
        role="radiogroup"
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        className="flex flex-wrap gap-2"
      >
        {REPORT_REASONS.map((reason) => {
          const active = reason === value;
          return (
            <button
              key={reason}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              onClick={() => onChange(reason)}
              className={cn(
                "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors disabled:opacity-60",
                active
                  ? "border-[var(--accent-soft-border)] bg-accent text-accent-foreground"
                  : "border-input bg-secondary text-muted-foreground"
              )}
            >
              {REPORT_REASON_LABELS[reason]}
            </button>
          );
        })}
      </div>
      <FieldError message={error} />
    </div>
  );
}
