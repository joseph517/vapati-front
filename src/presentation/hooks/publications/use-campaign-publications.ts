import { publicationsService } from "@/data/publications/publications.service";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

// Newest first, as the backend sends them
export function useCampaignPublications(campaignId: number) {
  return useApiQuery(publicationsService.keys.byCampaign(campaignId), () =>
    publicationsService.listByCampaign(campaignId)
  );
}
