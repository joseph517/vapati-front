export function TransactionIdPill({ value }: { value: string }) {
  return (
    <span className="rounded-md bg-[var(--track-soft)] px-2 py-[3px] font-mono text-xs text-muted-foreground">
      {value}
    </span>
  );
}
