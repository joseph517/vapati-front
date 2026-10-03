import type { CampaignStatus } from "@/domain/campaigns/campaign.types";

export type DonationStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED"; // only COMPLETED today

export type DonationResponseDTO = {
  id: number;
  donorUserId: number | null; // null if the donor deleted their account
  donorUserName: string | null; // null if the donor deleted their account
  campaignId: number;
  campaignName: string; // also for a deleted campaign
  campaignDeleted: boolean; // true only in my-donations, when the campaign was deleted
  amount: number; // DECIMAL(15,2)
  status: DonationStatus;
  transactionId: string | null; // "TXN-XXXXXXXX". null if the caller can't see it
  createdAt: string; // ISO LocalDateTime without zone, server time
  updatedAt: string;
};

export type CreateDonationRequest = {
  campaignId: number;
  amount: number; // > 0, up to 13 integer digits and 2 decimals
};

export type CreateDonationResponse = {
  message: string;
  donation: DonationResponseDTO;
  status: "COMPLETED";
};

export type DonationReceipt = DonationResponseDTO & { message: string };

// my-donations and a campaign's donations
export type DonationListResponse = {
  message: string;
  donations: DonationResponseDTO[]; // newest first
  total: number;
};

export type CampaignStatisticsDTO = {
  campaignId: number;
  campaignName: string;
  amountGoal: number;
  amountRaised: number;
  percentageReached: number; // 2 decimals, can exceed 100
  isGoalReached: boolean;
  status: CampaignStatus;
  totalDonors: number;
  averageDonation: number; // 2 decimals. 0 without donations
  totalDonations: number;
};

export type CampaignStatisticsResponse = {
  message: string;
  statistics: CampaignStatisticsDTO;
};
