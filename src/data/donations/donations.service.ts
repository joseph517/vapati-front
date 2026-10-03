import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  CampaignStatisticsResponse,
  CreateDonationRequest,
  CreateDonationResponse,
  DonationListResponse,
} from "@/domain/donations/donation.types";

type CampaignId = string | number;

const keys = {
  mine: () => "/api/donations/my-donations",
  byCampaign: (campaignId: CampaignId) => `/api/donations/campaign/${campaignId}`,
  statistics: (campaignId: CampaignId) =>
    `/api/donations/campaign/${campaignId}/statistics`,
};

export const donationsService = {
  keys,
  // Approved synchronously: the response already has status "COMPLETED"
  donate: (body: CreateDonationRequest) =>
    apiFetch<CreateDonationResponse>("/api/donations", {
      method: "POST",
      body,
      ...auth(),
    }),
  listMine: () => apiFetch<DonationListResponse>(keys.mine(), auth()),
  listByCampaign: (campaignId: CampaignId) =>
    apiFetch<DonationListResponse>(keys.byCampaign(campaignId), auth()),
  statistics: (campaignId: CampaignId) =>
    apiFetch<CampaignStatisticsResponse>(keys.statistics(campaignId), auth()),
};
