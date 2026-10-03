// "ID n" next to a name. `bare` shows only "n", for the table's ID column.
export function UserIdPill({ id, bare = false }: { id: number; bare?: boolean }) {
  return (
    <span className="rounded-md bg-[var(--track-soft)] px-2 py-[3px] font-mono text-xs text-muted-foreground">
      {bare ? id : `ID ${id}`}
    </span>
  );
}
