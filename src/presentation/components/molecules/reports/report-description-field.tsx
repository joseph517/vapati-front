import { useId } from "react";
import {
  REPORT_COUNTER_WARNING_AT,
  REPORT_DESCRIPTION_MAX_LENGTH,
} from "@/domain/reports/reports";
import { CharCounter } from "@/presentation/components/atoms/char-counter";
import { FieldError } from "@/presentation/components/atoms/field-error";
import { Label } from "@/presentation/components/ui/label";
import { Textarea } from "@/presentation/components/ui/textarea";
import { cn } from "@/presentation/utils/cn";
import {
  FIELD_LABEL_CLASSES,
  INVALID_FIELD_CLASSES,
} from "@/presentation/utils/form-classes";

// Optional "Contanos qué pasó" field of the report dialog.
export function ReportDescriptionField({
  value,
  onChange,
  disabled,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string | null;
}) {
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className={FIELD_LABEL_CLASSES}>
        Contanos qué pasó
        <span className="font-normal tracking-normal text-[var(--ink-faint)] normal-case">
          opcional
        </span>
      </Label>
      <Textarea
        id={id}
        rows={4}
        maxLength={REPORT_DESCRIPTION_MAX_LENGTH}
        placeholder="Cualquier detalle nos ayuda a revisarlo."
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        // dark: overrides shadcn's dark:bg-input/30 (the app has no dark theme).
        // overflow-wrap: with field-sizing-content, a long unbroken word would
        // widen the textarea and the dialog with it.
        className={cn(
          "resize-y bg-white [overflow-wrap:anywhere] dark:bg-white",
          INVALID_FIELD_CLASSES
        )}
      />
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <FieldError message={error} />
        </div>
        <span className="mt-[7px]">
          <CharCounter
            length={value.length}
            max={REPORT_DESCRIPTION_MAX_LENGTH}
            warnAt={REPORT_COUNTER_WARNING_AT}
          />
        </span>
      </div>
    </div>
  );
}
