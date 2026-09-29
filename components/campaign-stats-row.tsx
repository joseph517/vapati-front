import type { ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { CampaignStatisticsStatus } from "@/lib/hooks/use-campaign-statistics";
import type { CampaignStatisticsDTO } from "@/lib/types";
import { cn, formatCurrencyCOP } from "@/lib/utils";

export function CampaignStatsRow({
  statistics,
  status,
}: {
  statistics: CampaignStatisticsDTO | null;
  status: CampaignStatisticsStatus;
}) {
  if (status === "error") return null;

  const ready = status === "ready" && statistics !== null;

  return (
    <div className="mt-[18px] grid grid-cols-[repeat(3,minmax(0,1fr))] border-t border-[var(--divider)] pt-[18px]">
      <StatCell label="Donantes">
        {ready ? statistics.totalDonors : <Skeleton className="h-5 w-[40px]" />}
      </StatCell>
      <StatCell label="Donaciones" withDivider>
        {ready ? (
          statistics.totalDonations
        ) : (
          <Skeleton className="h-5 w-[40px]" />
        )}
      </StatCell>
      <StatCell label="Promedio" withDivider>
        {ready ? (
          formatCurrencyCOP(statistics.averageDonation)
        ) : (
          <Skeleton className="h-5 w-[88px]" />
        )}
      </StatCell>
    </div>
  );
}

function StatCell({
  label,
  withDivider = false,
  children,
}: {
  label: string;
  withDivider?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "min-w-0",
        withDivider && "border-l border-[var(--divider)] pl-[18px]"
      )}
    >
      <p className="text-[11.5px] tracking-[.07em] text-[var(--ink-label)] uppercase">
        {label}
      </p>
      <div className="mt-1 font-serif text-xl tracking-[-0.01em] text-foreground">
        {children}
      </div>
    </div>
  );
}
