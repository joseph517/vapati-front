"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
  CampaignResponseDTO,
  CampaignStatusHistoryResponseDTO,
} from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("es-CO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function CampaignStatusHistoryPanel({
  campaign,
  defaultOpen = false,
}: {
  campaign: CampaignResponseDTO;
  defaultOpen?: boolean;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useAuthStore((state) => state.userInfo);

  const [open, setOpen] = useState(defaultOpen);
  const [history, setHistory] = useState<
    CampaignStatusHistoryResponseDTO[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  // Invalidate any cached history when the campaign's status changes
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [invalidatedForStatus, setInvalidatedForStatus] = useState(
    campaign.status
  );
  if (invalidatedForStatus !== campaign.status) {
    setInvalidatedForStatus(campaign.status);
    setHistory(null);
    setError(null);
  }

  const loading = open && history === null && error === null;

  useEffect(() => {
    if (!open || history !== null || error !== null) return;
    let cancelled = false;

    apiFetch<CampaignStatusHistoryResponseDTO[]>(
      `/api/campaigns/${campaign.id}/status-history`,
      { accessToken }
    )
      .then((data) => {
        if (cancelled) return;
        setHistory(
          [...data].sort(
            (a, b) =>
              new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
          )
        );
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
  }, [open, history, error, campaign.id, accessToken]);

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
              {error}
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
                    {dateFormatter.format(new Date(entry.changedAt))} ·{" "}
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
