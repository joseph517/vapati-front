import { cn } from "@/presentation/utils/cn";

export type ChipOption<T extends string> = { value: T; label: string };

// Single choice as chips. `value` can be null: no chip checked yet.
// `chipClassName` overrides the chip padding.
export function ChipRadioGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled = false,
  chipClassName,
}: {
  label: string;
  options: readonly ChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  chipClassName?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => {
              if (!checked) onChange(option.value);
            }}
            className={cn(
              "rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
              checked
                ? "border-[var(--accent-soft-border)] bg-accent text-accent-foreground"
                : "border-input bg-secondary text-muted-foreground hover:text-foreground",
              chipClassName
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
