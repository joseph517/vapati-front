import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TITLE_WIDTHS = ["62%", "48%", "55%"];

// "card": inside the "Mis donaciones" card. "flush": inside the detail's "Donaciones" panel.
type DonationRowsSkeletonVariant = "card" | "flush";

const ROW_PADDING: Record<DonationRowsSkeletonVariant, string> = {
  card: "px-6 py-5",
  flush: "py-4",
};

// Three placeholder rows, separated by the divider. The caller provides the container.
export function DonationRowsSkeleton({
  variant = "card",
}: {
  variant?: DonationRowsSkeletonVariant;
}) {
  return (
    <>
      {TITLE_WIDTHS.map((titleWidth) => (
        <div
          key={titleWidth}
          className={cn(
            "grid grid-cols-[minmax(0,1fr)_auto] gap-[18px] border-t border-[var(--divider)] first:border-t-0",
            ROW_PADDING[variant],
          )}
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
