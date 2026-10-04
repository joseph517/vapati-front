export type ReportBreakdownRow = { key: string; label: string; count: number };

// Bar width relative to the largest count, so the largest fills the track.
function barWidth(count: number, max: number): string {
  return max === 0 ? "0%" : `${Math.round((count / max) * 100)}%`;
}

export function ReportBreakdownCard({
  title,
  rows,
}: {
  title: string;
  rows: readonly ReportBreakdownRow[];
}) {
  const max = Math.max(0, ...rows.map((row) => row.count));

  return (
    <div className="rounded-xl border border-border bg-card px-6 py-[22px]">
      <h3 className="mb-4 text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {rows.map((row) => (
          <div key={row.key}>
            <div className="flex justify-between gap-3 text-[13.5px]">
              <span className="text-[var(--ink-body)]">{row.label}</span>
              <span className="font-medium text-foreground tabular-nums">
                {row.count}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--track-soft)]">
              <div
                className="h-full rounded-full bg-[var(--accent-soft-border)]"
                style={{ width: barWidth(row.count, max) }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
