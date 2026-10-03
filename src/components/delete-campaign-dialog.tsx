"use client";

import { useRouter } from "next/navigation";
import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import type {
  CampaignResponseDTO,
  DeleteCampaignResponse,
} from "@/domain/campaigns/campaign.types";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";

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
