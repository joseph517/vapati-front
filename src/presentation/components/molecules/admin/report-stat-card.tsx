import { cn } from "@/presentation/utils/cn";

type ReportStatCardVariant = "highlight" | "default" | "total";

// One counter of the reports panel. `highlight` marks the pending ones and
// `total` is the dashed, unfilled summary.
export function ReportStatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: ReportStatCardVariant;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border px-5 py-[18px]",
        variant === "highlight" && "border-[var(--accent-soft-border)] bg-accent",
        variant === "default" && "border-border bg-card",
        variant === "total" && "border-dashed border-[var(--border-dashed)]"
      )}
    >
      <div className="flex items-center gap-[7px]">
        {variant === "highlight" && (
          <span aria-hidden className="size-1.5 rounded-full bg-primary" />
        )}
        <span
          className={cn(
            "text-[11.5px] leading-none tracking-[.07em] uppercase",
            variant === "highlight"
              ? "font-semibold text-accent-foreground"
              : "font-medium text-[var(--ink-label)]"
          )}
        >
          {label}
        </span>
      </div>
      <p
        className={cn(
          "mt-3 font-serif text-[34px] leading-none font-medium tabular-nums",
          variant === "highlight" && "text-accent-foreground",
          variant === "default" && "text-foreground",
          variant === "total" && "text-muted-foreground"
        )}
      >
        {value}
      </p>
    </div>
  );
}
