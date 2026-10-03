import { checkAmountFormat } from "@/lib/amount";
import type { CampaignResponseDTO } from "@/lib/types";

export const ANONYMOUS_DONOR_LABEL = "Anónimo";

// Returns null when the amount is valid. The first failing rule wins.
export function validateDonationAmount(raw: string): string | null {
  if (!raw || Number(raw) <= 0) {
    return "Ingresá un monto mayor a 0.";
  }
  switch (checkAmountFormat(raw)) {
    case "too-many-decimals":
      return "El monto admite hasta 2 decimales.";
    case "too-large":
      return "El monto es demasiado alto.";
    default:
      return null;
  }
}

// Returns null when the user can donate. A CLOSED campaign wins over ownership.
export function getDonationBlockReason(
  campaign: CampaignResponseDTO,
  userId: number | undefined
): string | null {
  if (campaign.status === "CLOSED") {
    return "Esta campaña está cerrada y ya no recibe donaciones.";
  }
  if (userId !== undefined && userId === campaign.userId) {
    return "No podés donar a tu propia campaña.";
  }
  return null;
}
