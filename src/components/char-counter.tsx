import { cn } from "@/lib/utils";

// "{length}/{max}" under a text field. From `warnAt` on it switches to the notice color.
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
        length >= warnAt ? "text-[var(--notice-ink)]" : "text-[var(--ink-faint)]"
      )}
    >
      {length}/{max}
    </span>
  );
}
