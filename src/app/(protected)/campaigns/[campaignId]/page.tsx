"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { campaignsService } from "@/data/campaigns/campaigns.service";
import type { DonationReceipt } from "@/domain/donations/donation.types";
import { StatusBadge } from "@/presentation/components/atoms/status-badge";
import {
  CategoryChips,
} from "@/presentation/components/molecules/categories/category-chips";
import {
  DonationReceiptCard,
} from "@/presentation/components/molecules/donations/donation-receipt-card";
import {
  CampaignProgressPanel,
} from "@/presentation/components/organisms/campaigns/campaign-progress-panel";
import {
  CampaignStatusHistoryPanel,
} from "@/presentation/components/organisms/campaigns/campaign-status-history-panel";
import {
  CampaignDonationsPanel,
} from "@/presentation/components/organisms/donations/campaign-donations-panel";
import {
  DonateDialog,
} from "@/presentation/components/organisms/donations/donate-dialog";
import {
  CampaignPublicationsPanel,
} from "@/presentation/components/organisms/publications/campaign-publications-panel";
import { Button } from "@/presentation/components/ui/button";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import {
  useCampaignStatistics,
} from "@/presentation/hooks/donations/use-campaign-statistics";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

export default function CampaignDetailPage() {
  return (
    <Suspense fallback={null}>
      <CampaignDetail />
    </Suspense>
  );
}

function CampaignDetail() {
  const params = useParams<{ campaignId: string }>();
  const searchParams = useSearchParams();
  // Set by the edit page after saving, so the history shows the new transitions.
  const historyOpen = searchParams.get("history") === "open";
  const {
    data: campaign,
    loading,
    error,
    reload,
  } = useApiQuery(campaignsService.keys.detail(params.campaignId), () =>
    campaignsService.getById(params.campaignId)
  );
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const statistics = useCampaignStatistics(params.campaignId);
  const [donationsReloadKey, setDonationsReloadKey] = useState(0);

  // Drop the receipt when navigating to another campaign
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [receiptForCampaign, setReceiptForCampaign] = useState(
    params.campaignId
  );
  if (receiptForCampaign !== params.campaignId) {
    setReceiptForCampaign(params.campaignId);
    setReceipt(null);
  }

  function handleDonated(donation: DonationReceipt) {
    setReceipt(donation);
    // In the background the skeleton isn't shown, so the panels below stay
    // mounted and keep their state (e.g. an open "Donaciones" section).
    reload({ background: true });
    statistics.reload();
    setDonationsReloadKey((key) => key + 1);
  }

  return (
    <main className="mx-auto max-w-[800px] px-6 pt-9 pb-20">
      <Link
        href="/campaigns"
        className="mb-4 block text-[13.5px] text-muted-foreground hover:text-foreground"
      >
        ← Todas las campañas
      </Link>

      {loading && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-6">
          <h1 className="font-serif text-base text-destructive">
            No encontramos esta campaña
          </h1>
          <p className="mt-1.5 text-[13.5px] text-destructive/90">{error.message}</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/campaigns">Volver al listado</Link>
          </Button>
        </div>
      )}

      {!loading && !error && campaign && (
        <>
          {receipt && <DonationReceiptCard receipt={receipt} />}

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium tracking-[.08em] text-[var(--ink-eyebrow)] uppercase">
              creada por{" "}
              <Link
                href={`/users/${campaign.userId}`}
                className="text-primary underline decoration-[var(--accent-soft-border)] underline-offset-[3px] hover:text-[var(--accent-hover)] hover:decoration-[var(--accent-hover)]"
              >
                {campaign.userName}
              </Link>
            </span>
            <StatusBadge status={campaign.status} />
          </div>
          <div className="mt-3">
            <CategoryChips categories={campaign.categories} />
          </div>
          <h1 className="mt-3 font-serif text-[38px] leading-[1.1] tracking-[-0.02em] text-foreground">
            {campaign.name}
          </h1>
          <p className="mt-4 mb-[34px] max-w-[62ch] text-base leading-[1.65] text-[var(--ink-body)]">
            {campaign.description}
          </p>

          <CampaignProgressPanel
            campaign={campaign}
            statistics={statistics.statistics}
            statisticsStatus={statistics.status}
            onDonateClick={() => setIsDonateOpen(true)}
            onOwnerActionUpdated={() => reload()}
          />

          <CampaignPublicationsPanel
            campaign={campaign}
            onCampaignStale={() => reload({ background: true })}
          />

          <CampaignStatusHistoryPanel
            campaign={campaign}
            defaultOpen={historyOpen}
          />

          <CampaignDonationsPanel
            campaignId={campaign.id}
            reloadKey={donationsReloadKey}
          />

          <DonateDialog
            open={isDonateOpen}
            onOpenChange={setIsDonateOpen}
            campaign={campaign}
            onDonated={handleDonated}
          />
        </>
      )}
    </main>
  );
}
