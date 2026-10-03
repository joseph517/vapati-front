"use client";

import { useState } from "react";
import type { CampaignResponseDTO } from "@/domain/campaigns/campaign.types";
import { Skeleton } from "@/presentation/components/ui/skeleton";
import { useSession } from "@/presentation/hooks/auth/use-session";
import { useCampaignStatusHistory } from "@/presentation/hooks/campaigns/use-campaign-status-history";
import { formatDateTime } from "@/presentation/utils/format";

export function CampaignStatusHistoryPanel({
  campaign,
  defaultOpen = false,
}: {
  campaign: CampaignResponseDTO;
  defaultOpen?: boolean;
}) {
  const userInfo = useSession((state) => state.userInfo);

  const [open, setOpen] = useState(defaultOpen);

  // A status change discards the loaded history. Oldest transition first.
  const {
    data: history,
    loading,
    error,
  } = useCampaignStatusHistory(campaign, open);

  if (userInfo?.userId !== campaign.userId) return null;

  return (
    <div className="mt-5 rounded-2xl border border-border bg-card p-[26px]">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg text-foreground">
          Historial de estado
        </h2>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="text-[13.5px] font-medium text-primary underline"
        >
          {open ? "Ocultar" : "Ver historial"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          {loading && (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2.5 text-[13.5px] text-destructive">
              {error.message}
            </div>
          )}

          {!loading && !error && history && history.length === 0 && (
            <p className="text-[13.5px] text-muted-foreground">Sin historial.</p>
          )}

          {!loading && !error && history && history.length > 0 && (
            <ul className="flex flex-col gap-2">
              {history.map((entry, index) => {
                const changedByLabel =
                  entry.changedByUserId === null
                    ? "automático"
                    : entry.changedByUserId === userInfo?.userId
                      ? userInfo.userName
                      : `usuario ${entry.changedByUserId}`;
                return (
                  <li key={index} className="text-[13.5px] text-[var(--ink-body)]">
                    {entry.previousStatus ?? "—"} {entry.newStatus} ·{" "}
                    {formatDateTime(entry.changedAt)} ·{" "}
                    {changedByLabel}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
