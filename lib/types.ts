export type CampaignStatus = "ACTIVE" | "COMPLETED" | "CLOSED";

export type CampaignStatusHistoryResponseDTO = {
  previousStatus: CampaignStatus | null;
  newStatus: CampaignStatus;
  changedByUserId: number | null; // null for automatic transitions
  changedAt: string; // ISO datetime
};

export type CampaignResponseDTO = {
  id: number;
  name: string;
  description: string;
  amountGoal: number;
  amountRaised: number;
  userId: number;
  userName: string;
  categories: CategoryDTO[];
  status: CampaignStatus;
};

export type UserInfo = {
  userId: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  userName: string;
  fullName: string;
};

export type AuthResponse = {
  accessToken: string; // 1 hour. Sent as Authorization: Bearer
  refreshToken: string; // 7 days. Only for refresh and logout
  userInfo: UserInfo;
};

export type ApiError = {
  error: string;
  message: string;
  timestamp: string;
  fields?: Record<string, string>; // only when error === "Validation failed"
  path?: string; // only on the unauthenticated 401 and the blocked-account 403
};

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

export type CategoryDTO = {
  id: number;
  name: string;
  description: string;
};

export type CreateCampaignRequest = {
  name: string;
  description: string;
  amountGoal: number;
  categoryIds: number[];
};

export type CreateCampaignResponse = {
  message: string;
  campaignId: number;
  status: "CREATED"; // not a CampaignStatus
};

export type UpdateCampaignRequest = {
  name?: string;
  description?: string;
  amountGoal?: number;
  categoryIds: number[]; // always sent, 1 to 5: replaces all of them
};

export type MyCampaignsResponse = {
  message: string;
  campaigns: CampaignResponseDTO[];
  total: number;
};

export type DeleteCampaignResponse = {
  message: string;
  campaignId: number;
};
