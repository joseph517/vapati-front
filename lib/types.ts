export type CampaignStatus = "ACTIVE" | "COMPLETED" | "CLOSED";

export type CampaignStatusHistoryResponseDTO = {
  previousStatus: CampaignStatus | null;
  newStatus: CampaignStatus;
  changedByUserId: number;
  changedAt: string; // ISO datetime
};

export type CampaignResponseDTO = {
  id: number;
  name: string;
  description: string;
  amountGoal: number;
  amountRaised: number;
  userId: number;
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

export type ApiError = {
  error: string;
  message: string;
  timestamp: string;
};

export type DonationResponseDTO = {
  id: number;
  donorUserId: number;
  donorUserName: string;
  campaignId: number;
  campaignName: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
};

export type CategoryDTO = {
  id: number;
  name: string;
  description: string;
};
