import { Skeleton } from "@/components/ui/skeleton";

export function CampaignGridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-[22px]"
        >
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="mt-4 h-[7px] w-full rounded-full" />
          <Skeleton className="h-3.5 w-1/2" />
        </div>
      ))}
    </div>
  );
}
