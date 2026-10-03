import { Skeleton } from "@/components/ui/skeleton";

// Loading placeholder for the followers / following list: 4 rows
export function FollowListSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3.5 p-2.5"
        >
          <Skeleton className="size-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3.5 w-[140px] max-w-full" />
            <Skeleton className="h-3 w-[96px] max-w-full bg-[var(--track-soft)]" />
          </div>
          <Skeleton className="h-3 w-[88px] bg-[var(--track-soft)]" />
        </div>
      ))}
    </div>
  );
}
