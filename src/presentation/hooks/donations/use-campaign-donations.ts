import { donationsService } from "@/data/donations/donations.service";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

// Fetched only while `enabled`. A new `reloadKey` (after a donation) discards
// the loaded list: refetched now if enabled, or once it is enabled again.
export function useCampaignDonations(
  campaignId: number,
  enabled: boolean,
  reloadKey: number
) {
  return useApiQuery(
    donationsService.keys.byCampaign(campaignId),
    () => donationsService.listByCampaign(campaignId),
    { enabled, resetKeys: [reloadKey] }
  );
}
