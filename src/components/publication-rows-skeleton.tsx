import { Skeleton } from "@/components/ui/skeleton";

const LAST_LINE_WIDTHS = ["72%", "48%"];

// Two placeholder publications: author line and two text lines.
export function PublicationRowsSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-[22px] pt-1">
      {LAST_LINE_WIDTHS.map((width) => (
        <div key={width} className="flex flex-col gap-2">
          <Skeleton className="h-3 w-[180px]" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5" style={{ width }} />
        </div>
      ))}
    </div>
  );
}
