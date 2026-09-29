import { Skeleton } from "@/components/ui/skeleton";

const TITLE_WIDTHS = ["62%", "48%", "55%"];

// Three placeholder rows, separated by the divider. The caller provides the container.
export function DonationRowsSkeleton() {
  return (
    <>
      {TITLE_WIDTHS.map((titleWidth) => (
        <div
          key={titleWidth}
          className="grid grid-cols-[minmax(0,1fr)_auto] gap-[18px] border-t border-[var(--divider)] px-6 py-5 first:border-t-0"
        >
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4" style={{ width: titleWidth }} />
            <Skeleton className="h-3 w-[140px]" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <Skeleton className="h-[18px] w-[96px]" />
            <Skeleton className="h-[18px] w-[112px]" />
          </div>
        </div>
      ))}
    </>
  );
}
