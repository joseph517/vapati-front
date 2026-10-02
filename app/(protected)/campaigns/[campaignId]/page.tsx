"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CampaignDonationsPanel } from "@/components/campaign-donations-panel";
import { CampaignProgressPanel } from "@/components/campaign-progress-panel";
import { CampaignStatusHistoryPanel } from "@/components/campaign-status-history-panel";
import { CategoryChips } from "@/components/category-chips";
import { DonateDialog, type DonationReceipt } from "@/components/donate-dialog";
import { DonationReceiptCard } from "@/components/donation-receipt-card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { apiFetch, toErrorMessage } from "@/lib/api";
import { useCampaignStatistics } from "@/lib/hooks/use-campaign-statistics";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO } from "@/lib/types";

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
  const accessToken = useAuthStore((state) => state.accessToken);
  const [campaign, setCampaign] = useState<CampaignResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const statistics = useCampaignStatistics(params.campaignId);
  const [donationsReloadKey, setDonationsReloadKey] = useState(0);

  // In the background the skeleton isn't shown, so the panels below stay
  // mounted and keep their state (e.g. an open "Donaciones" section).
  function loadCampaign({ background = false } = {}) {
    if (!background) setLoading(true);
    setError(null);
    apiFetch<CampaignResponseDTO>(`/api/campaigns/${params.campaignId}`, {
      accessToken,
    })
      .then((data) => setCampaign(data))
      .catch((err) => {
        setError(toErrorMessage(err));
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReceipt(null);
    loadCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.campaignId]);

  function handleDonated(donation: DonationReceipt) {
    setReceipt(donation);
    loadCampaign({ background: true });
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
          <p className="mt-1.5 text-[13.5px] text-destructive/90">{error}</p>
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
            onOwnerActionUpdated={loadCampaign}
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
            accessToken={accessToken}
            onDonated={handleDonated}
          />
        </>
      )}
    </main>
  );
}
