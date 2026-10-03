import { campaignsService } from "@/data/campaigns/campaigns.service";

// Module-level, so the object and its functions are the same on every render
const campaignActions = {
  close: campaignsService.close,
  activate: campaignsService.activate,
  remove: campaignsService.remove,
};

export function useCampaignActions() {
  return campaignActions;
}
