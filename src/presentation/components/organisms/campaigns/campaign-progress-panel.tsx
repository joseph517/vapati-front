"use client";

import type { CampaignResponseDTO } from "@/domain/campaigns/campaign.types";
import type { CampaignStatisticsDTO } from "@/domain/donations/donation.types";
import { getDonationBlockReason } from "@/domain/donations/donations";
import type { LoadStatus } from "@/domain/shared/shared.types";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import { ProgressBar } from "@/presentation/components/atoms/progress-bar";
import {
  CampaignStatsRow,
} from "@/presentation/components/molecules/campaigns/campaign-stats-row";
import {
  CampaignOwnerActions,
} from "@/presentation/components/organisms/campaigns/campaign-owner-actions";
import { Button } from "@/presentation/components/ui/button";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { useSession } from "@/presentation/hooks/auth/use-session";
import { formatCurrencyCOP } from "@/presentation/utils/format";

export function CampaignProgressPanel({
  campaign,
  statistics,
  statisticsStatus,
  onDonateClick,
  onOwnerActionUpdated,
}: {
  campaign: CampaignResponseDTO;
  statistics: CampaignStatisticsDTO | null;
  statisticsStatus: LoadStatus;
  onDonateClick: () => void;
  onOwnerActionUpdated: () => void;
}) {
  const userInfo = useSession((state) => state.userInfo);
  const donationBlockReason = getDonationBlockReason(
    campaign,
    userInfo?.userId
  );

  // With statistics the percentage and the goal come from the backend.
  // While they load or when they fail, they're computed from the campaign.
  const fromStatistics = statisticsStatus === "ready" && statistics !== null;
  const pct = fromStatistics
    ? Math.round(statistics.percentageReached)
    : Math.round((campaign.amountRaised / campaign.amountGoal) * 100);
  const goalReached = fromStatistics
    ? statistics.isGoalReached
    : campaign.amountRaised >= campaign.amountGoal;
  const remaining = Math.max(0, campaign.amountGoal - campaign.amountRaised);

  return (
    <div className="rounded-2xl border border-border bg-card p-[26px]">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-serif text-[34px] leading-none font-medium text-foreground">
          {formatCurrencyCOP(campaign.amountRaised)}
        </span>
        <span className="text-sm text-muted-foreground">
          de {formatCurrencyCOP(campaign.amountGoal)}
        </span>
      </div>
      {/* ProgressBar caps the value at 100. */}
      <ProgressBar value={pct} className="mt-4 h-[9px]" />
      <div className="mt-2.5 flex items-center justify-between text-[13px] text-[var(--ink-label)]">
        {statisticsStatus === "loading" ? (
          <Skeleton className="h-3 w-[110px]" />
        ) : (
          <span>{pct}% de la meta</span>
        )}
        {goalReached ? (
          <span className="flex items-center gap-[7px] font-medium text-[var(--success-ink)]">
            <span className="size-[7px] shrink-0 rounded-full bg-[var(--success)]" />
            Meta alcanzada
          </span>
        ) : (
          <span>Faltan {formatCurrencyCOP(remaining)}</span>
        )}
      </div>
      <CampaignStatsRow statistics={statistics} status={statisticsStatus} />
      {donationBlockReason ? (
        <NoticeAlert role="status" className="mt-6">
          {donationBlockReason}
        </NoticeAlert>
      ) : (
        <Button
          onClick={onDonateClick}
          className="mt-6 w-full py-[14px] text-[15px] font-semibold"
        >
          Donar a esta campaña
        </Button>
      )}
      <CampaignOwnerActions campaign={campaign} onUpdated={onOwnerActionUpdated} />
    </div>
  );
}
