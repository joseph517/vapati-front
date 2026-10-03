import { campaignsService } from "@/data/campaigns/campaigns.service";
import type {
  CampaignResponseDTO,
  CampaignStatusHistoryResponseDTO,
} from "@/domain/campaigns/campaign.types";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

function oldestFirst(
  entries: CampaignStatusHistoryResponseDTO[]
): CampaignStatusHistoryResponseDTO[] {
  return [...entries].sort(
    (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
  );
}

// Fetched only while `enabled`. A status change discards the loaded history.
export function useCampaignStatusHistory(
  campaign: CampaignResponseDTO,
  enabled: boolean
) {
  return useApiQuery(
    campaignsService.keys.statusHistory(campaign.id),
    () => campaignsService.statusHistory(campaign.id),
    { enabled, resetKeys: [campaign.status], select: oldestFirst }
  );
}
