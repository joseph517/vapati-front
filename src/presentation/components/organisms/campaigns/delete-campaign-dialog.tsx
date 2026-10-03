"use client";

import { useRouter } from "next/navigation";
import type { CampaignResponseDTO } from "@/domain/campaigns/campaign.types";
import {
  ConfirmDeleteDialog,
} from "@/presentation/components/molecules/confirm-delete-dialog";
import { useCampaignActions } from "@/presentation/hooks/campaigns/use-campaign-actions";

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
  const campaignActions = useCampaignActions();

  async function handleConfirm() {
    await campaignActions.remove(campaign.id);
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
