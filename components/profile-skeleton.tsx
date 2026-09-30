import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProfileSkeletonProps {
  variant: "own" | "public";
}

// Loading placeholder for /profile ("own") and /users/[userId] ("public")
export function ProfileSkeleton({ variant }: ProfileSkeletonProps) {
  const isOwn = variant === "own";

  return (
    <div aria-busy="true">
      <div className="flex flex-wrap items-center gap-[22px]">
        <Skeleton className="size-[88px] shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Skeleton className="h-8 w-[260px] max-w-full" />
          <Skeleton
            className={cn(
              "h-3.5 bg-[var(--track-soft)]",
              isOwn ? "w-[110px]" : "w-[130px]"
            )}
          />
        </div>
      </div>

      {isOwn ? (
        <>
          <div className="mt-[30px] rounded-xl border border-border bg-card p-6">
            <Skeleton className="h-3 w-20" />
            <div className="mt-3 flex flex-col gap-2">
              <Skeleton className="h-4 w-full bg-[var(--track-soft)]" />
              <Skeleton className="h-4 w-3/5 bg-[var(--track-soft)]" />
            </div>
            <div className="mt-[22px] flex flex-wrap gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-[35px] w-24 rounded-full" />
              ))}
            </div>
          </div>
          <div className="mt-[18px] h-[118px] rounded-xl border border-border bg-card" />
        </>
      ) : (
        <div className="mt-[30px] h-40 rounded-xl border border-border bg-card" />
      )}
    </div>
  );
}
