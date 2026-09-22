"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO } from "@/lib/types";

export function CampaignOwnerActions({
  campaign,
  onUpdated,
}: {
  campaign: CampaignResponseDTO;
  onUpdated: () => void;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userInfo = useAuthStore((state) => state.userInfo);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (userInfo?.userId !== campaign.userId) return null;

  const isClosed = campaign.status === "CLOSED";

  async function handleClick() {
    setBusy(true);
    setError(null);
    try {
      await apiFetch(
        `/api/campaigns/${campaign.id}/${isClosed ? "activate" : "close"}`,
        { method: "PUT", accessToken }
      );
      onUpdated();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Ocurrió un error inesperado. Intentá de nuevo."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-5 border-t border-[var(--divider)] pt-5">
      {error && (
        <div className="mb-3 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2.5 text-[13.5px] text-destructive">
          {error}
        </div>
      )}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant={isClosed ? "default" : "outline"}
          disabled={busy}
          onClick={handleClick}
          className="flex-1 py-[14px] text-[15px] font-semibold"
        >
          {isClosed ? "Reactivar campaña" : "Cerrar campaña"}
        </Button>
        {busy && (
          <span className="animate-pulse text-[13px] text-muted-foreground opacity-85">
            procesando…
          </span>
        )}
      </div>
    </div>
  );
}
