import { Skeleton } from "@/presentation/components/ui/skeleton";

// Title, status line and the three cards (report, review, form)
export function AdminReportDetailSkeleton() {
  return (
    <div aria-busy="true">
      <Skeleton className="h-8 w-60 max-w-full" />
      <div className="mt-3 flex items-center gap-2.5">
        <Skeleton className="h-5 w-[84px] rounded-full" />
        <Skeleton className="h-3.5 w-[180px] bg-[var(--track-soft)]" />
      </div>
      <div className="mt-[30px] h-[210px] rounded-xl border border-border bg-card" />
      <div className="mt-[18px] h-[118px] rounded-xl border border-border bg-card" />
      <div className="mt-[18px] h-60 rounded-xl border border-border bg-card" />
    </div>
  );
}
