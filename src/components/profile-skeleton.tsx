import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/presentation/utils/cn";

interface ProfileSkeletonProps {
  variant: "own" | "public" | "admin";
}

function AboutCardSkeleton({ className }: { className: string }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
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
  );
}

function PrivateDataCardSkeleton() {
  return (
    <div className="mt-[18px] h-[118px] rounded-xl border border-border bg-card" />
  );
}

// Loading placeholder for /profile ("own"), /users/[userId] ("public") and
// /admin/users/[userId] ("admin": no stats, private data before the about card)
export function ProfileSkeleton({ variant }: ProfileSkeletonProps) {
  return (
    <div aria-busy="true">
      <div className="flex flex-wrap items-center gap-[22px]">
        <Skeleton className="size-[88px] shrink-0 rounded-full" />
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">
          <Skeleton className="h-8 w-[260px] max-w-full" />
          <Skeleton
            className={cn(
              "h-3.5 bg-[var(--track-soft)]",
              variant === "public" ? "w-[130px]" : "w-[110px]"
            )}
          />
          {variant !== "admin" && (
            <div className="mt-0.5 flex gap-[18px]">
              <Skeleton className="h-3.5 w-[92px] bg-[var(--track-soft)]" />
              <Skeleton className="h-3.5 w-[84px] bg-[var(--track-soft)]" />
            </div>
          )}
        </div>
      </div>

      {variant === "own" && (
        <>
          <AboutCardSkeleton className="mt-[30px]" />
          <PrivateDataCardSkeleton />
        </>
      )}
      {variant === "public" && (
        <div className="mt-[30px] h-40 rounded-xl border border-border bg-card" />
      )}
      {variant === "admin" && (
        <>
          <PrivateDataCardSkeleton />
          <AboutCardSkeleton className="mt-[30px]" />
        </>
      )}
    </div>
  );
}
