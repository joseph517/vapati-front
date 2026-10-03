import { Skeleton } from "@/presentation/components/ui/skeleton";

// Loading placeholder for edit profile: four fields, "Sobre vos" and interest chips.
export function ProfileEditSkeleton() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
      <div className="grid grid-cols-2 gap-3.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-16 w-full" />
      </div>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-[35px] w-24 rounded-full" />
        ))}
      </div>
    </div>
  );
}
