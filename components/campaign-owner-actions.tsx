"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteCampaignDialog } from "@/components/delete-campaign-dialog";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  const [deleteOpen, setDeleteOpen] = useState(false);

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
      <div className="flex flex-wrap items-center gap-2.5">
        <Button
          asChild
          variant="outline"
          size="sm"
          className={cn(busy && "pointer-events-none opacity-50")}
        >
          <Link
            href={`/campaigns/${campaign.id}/edit`}
            aria-disabled={busy || undefined}
          >
            Editar
          </Link>
        </Button>
        {isClosed ? (
          <Button
            type="button"
            disabled={busy}
            onClick={handleClick}
            className="text-sm font-semibold"
          >
            Reactivar campaña
          </Button>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={handleClick}
          >
            Cerrar campaña
          </Button>
        )}
        {busy && (
          <span className="animate-pulse text-[13px] text-muted-foreground opacity-85">
            procesando…
          </span>
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={busy}
          onClick={() => setDeleteOpen(true)}
          className="ml-auto border-[var(--danger-border)] bg-white text-destructive hover:border-[var(--danger-border-strong)] hover:bg-[var(--danger-bg)] hover:text-destructive"
        >
          Borrar campaña
        </Button>
      </div>
      <DeleteCampaignDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        campaign={campaign}
      />
    </div>
  );
}
