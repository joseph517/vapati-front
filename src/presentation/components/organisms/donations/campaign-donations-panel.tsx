"use client";

import { useState } from "react";
import {
  CampaignDonationRow,
} from "@/presentation/components/molecules/donations/campaign-donation-row";
import {
  DonationRowsSkeleton,
} from "@/presentation/components/molecules/donations/donation-rows-skeleton";
import { useCampaignDonations } from "@/presentation/hooks/donations/use-campaign-donations";

// Collapsible "Donaciones" section of the campaign detail, visible to anyone.
// It loads on first open and `reloadKey` changes after a donation.
export function CampaignDonationsPanel({
  campaignId,
  reloadKey,
}: {
  campaignId: number;
  reloadKey: number;
}) {
  const [open, setOpen] = useState(false);

  // A donation (new `reloadKey`) discards the loaded list: refetched now if
  // open, or on the next open if closed.
  const { data, loading, error } = useCampaignDonations(
    campaignId,
    open,
    reloadKey
  );

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-[26px]">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-lg font-medium text-foreground">Donaciones</h2>
          {data && (
            <span className="text-[13px] text-[var(--ink-faint)]">
              {data.total}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="text-[13.5px] font-medium text-primary underline"
        >
          {open ? "Ocultar" : "Ver donaciones"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          {loading && <DonationRowsSkeleton variant="flush" />}

          {!loading && error && (
            <div className="rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2.5 text-[13.5px] text-destructive">
              {error.message}
            </div>
          )}

          {!loading && !error && data && data.donations.length === 0 && (
            <div className="rounded-[9px] border-[1.5px] border-dashed border-[var(--border-dashed)] p-5 text-center text-[13.5px] text-muted-foreground">
              Todavía no hay donaciones.
            </div>
          )}

          {!loading && !error && data && data.donations.length > 0 && (
            <div className="divide-y divide-[var(--divider)]">
              {data.donations.map((donation) => (
                <CampaignDonationRow key={donation.id} donation={donation} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
