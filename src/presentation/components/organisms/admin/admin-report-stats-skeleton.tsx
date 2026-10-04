import { Skeleton } from "@/presentation/components/ui/skeleton";

export const REPORT_STAT_CARDS_GRID =
  "grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-[18px]";
export const REPORT_BREAKDOWN_GRID =
  "mt-[18px] grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-start gap-[18px]";

// Five counters and two breakdown panels
export function AdminReportStatsSkeleton() {
  return (
    <div aria-busy="true">
      <div className={REPORT_STAT_CARDS_GRID}>
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="rounded-xl border border-border bg-card px-5 py-[18px]"
          >
            <Skeleton className="h-[11px] w-[70px]" />
            <Skeleton className="mt-3.5 h-[30px] w-12" />
          </div>
        ))}
      </div>
      <div className={REPORT_BREAKDOWN_GRID}>
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3.5 rounded-xl border border-border bg-card px-6 py-[22px]"
          >
            <Skeleton className="h-[11px] w-[90px]" />
            <Skeleton className="h-3.5 w-full bg-[var(--track-soft)]" />
            <Skeleton className="h-3.5 w-[85%] bg-[var(--track-soft)]" />
            <Skeleton className="h-3.5 w-[60%] bg-[var(--track-soft)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
