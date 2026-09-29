"use client";

import { useEffect, useState } from "react";
import { CampaignDonationRow } from "@/components/campaign-donation-row";
import { DonationRowsSkeleton } from "@/components/donation-rows-skeleton";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { DonationListResponse } from "@/lib/types";

// Collapsible "Donaciones" section of the campaign detail, visible to anyone.
// It loads on first open and `reloadKey` changes after a donation.
export function CampaignDonationsPanel({
  campaignId,
  reloadKey,
}: {
  campaignId: number;
  reloadKey: number;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [open, setOpen] = useState(false);
  const [data, setData] = useState<DonationListResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Discard the loaded list when a donation invalidates it: refetched now if
  // open, or on the next open if closed
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [invalidatedForKey, setInvalidatedForKey] = useState(reloadKey);
  if (invalidatedForKey !== reloadKey) {
    setInvalidatedForKey(reloadKey);
    setData(null);
    setError(null);
  }

  const loading = open && data === null && error === null;

  useEffect(() => {
    if (!open || data !== null || error !== null) return;
    let cancelled = false;

    apiFetch<DonationListResponse>(`/api/donations/campaign/${campaignId}`, {
      accessToken,
    })
      .then((response) => {
        if (!cancelled) setData(response);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Ocurrió un error inesperado. Intentá de nuevo."
        );
      });

    return () => {
      cancelled = true;
    };
  }, [open, data, error, campaignId, accessToken]);

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-[26px]">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <h2 className="font-serif text-lg text-foreground">Donaciones</h2>
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
          {loading && <DonationRowsSkeleton />}

          {!loading && error && (
            <div className="rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2.5 text-[13.5px] text-destructive">
              {error}
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
