"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CampaignOwnerActions } from "@/components/campaign-owner-actions";
import { CategoryChips } from "@/components/category-chips";
import { DonateDialog, type DonationReceipt } from "@/components/donate-dialog";
import { ProgressBar } from "@/components/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/status-badge";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO } from "@/lib/types";
import { formatCurrencyCOP } from "@/lib/utils";

export default function CampaignDetailPage() {
  const params = useParams<{ campaignId: string }>();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [campaign, setCampaign] = useState<CampaignResponseDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);

  function loadCampaign() {
    setLoading(true);
    setError(null);
    apiFetch<CampaignResponseDTO>(`/api/campaigns/${params.campaignId}`, {
      accessToken,
    })
      .then((data) => setCampaign(data))
      .catch((err) => {
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Ocurrió un error inesperado. Intentá de nuevo."
        );
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
    loadCampaign();
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
          {receipt && (
            <div className="mb-[26px] rounded-xl border border-[var(--success-border)] bg-[var(--success-bg)] px-[22px] py-5">
              <div className="flex items-center gap-2">
                <span className="size-2 shrink-0 rounded-full bg-[var(--success)]" />
                <h2 className="font-serif text-[17px] font-medium text-[var(--success-ink)]">
                  {receipt.message}
                </h2>
              </div>
              <p className="mt-1.5 text-[13.5px] text-[var(--success-ink-soft)]">
                Tu aporte de {formatCurrencyCOP(receipt.amount)} quedó
                aprobado al instante. Gracias.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 font-mono text-xs">
                <span className="rounded-md border border-[var(--success-pill-border)] px-2.5 py-1.5">
                  {receipt.status}
                </span>
                <span className="rounded-md border border-[var(--success-pill-border)] px-2.5 py-1.5">
                  {receipt.transactionId}
                </span>
                <span className="rounded-md border border-[var(--success-pill-border)] px-2.5 py-1.5">
                  {receipt.id}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-medium tracking-[.08em] text-[var(--ink-eyebrow)] uppercase">
              Campaña #{campaign.id} · creada por usuario {campaign.userId}
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
            onDonateClick={() => setIsDonateOpen(true)}
            onOwnerActionUpdated={loadCampaign}
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

function CampaignProgressPanel({
  campaign,
  onDonateClick,
  onOwnerActionUpdated,
}: {
  campaign: CampaignResponseDTO;
  onDonateClick: () => void;
  onOwnerActionUpdated: () => void;
}) {
  const pct = Math.min(
    100,
    Math.round((campaign.amountRaised / campaign.amountGoal) * 100)
  );
  const remaining = Math.max(0, campaign.amountGoal - campaign.amountRaised);

  return (
    <div className="rounded-2xl border border-border bg-card p-[26px]">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-serif text-[34px] leading-none text-foreground">
          {formatCurrencyCOP(campaign.amountRaised)}
        </span>
        <span className="text-sm text-muted-foreground">
          de {formatCurrencyCOP(campaign.amountGoal)}
        </span>
      </div>
      <ProgressBar value={pct} className="mt-4 h-[9px]" />
      <div className="mt-2.5 flex items-center justify-between text-[13px] text-[var(--ink-label)]">
        <span>{pct}% de la meta</span>
        <span>Faltan {formatCurrencyCOP(remaining)}</span>
      </div>
      <Button
        onClick={onDonateClick}
        className="mt-6 w-full py-[14px] text-[15px] font-semibold"
      >
        Donar a esta campaña
      </Button>
      <CampaignOwnerActions campaign={campaign} onUpdated={onOwnerActionUpdated} />
    </div>
  );
}
