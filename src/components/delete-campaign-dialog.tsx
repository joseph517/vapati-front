"use client";

import { useRouter } from "next/navigation";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useAuthStore } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  CampaignResponseDTO,
  DeleteCampaignResponse,
} from "@/domain/campaigns/campaign.types";

export function DeleteCampaignDialog({
  open,
  onOpenChange,
  campaign,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: CampaignResponseDTO;
}) {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  async function handleConfirm() {
    await apiFetch<DeleteCampaignResponse>(`/api/campaigns/${campaign.id}`, {
      method: "DELETE",
      accessToken,
    });
    router.replace("/campaigns/mine?flash=campaign-deleted");
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title={<>Vas a borrar «{campaign.name}»</>}
      description="Deja de verse en todos lados, también en Mis campañas. No se puede deshacer."
      note="Las donaciones que recibió se conservan."
      confirmLabel="Borrar campaña"
      onConfirm={handleConfirm}
    />
  );
}
