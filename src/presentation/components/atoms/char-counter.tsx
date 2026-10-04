import { cn } from "@/presentation/utils/cn";

// "{length}/{max}" under a text field. From `warnAt` on it switches to the notice color,
// and over `max` to the destructive one.
export function CharCounter({
  length,
  max,
  warnAt,
}: {
  length: number;
  max: number;
  warnAt: number;
}) {
  return (
    <span
      className={cn(
        "text-[12.5px] tabular-nums",
        length > max
          ? "text-destructive"
          : length >= warnAt
            ? "text-[var(--notice-ink)]"
            : "text-[var(--ink-faint)]"
      )}
    >
      {length}/{max}
    </span>
  );
}
