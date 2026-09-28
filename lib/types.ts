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
  accessToken: string; // 1 hora. Va en Authorization: Bearer
  refreshToken: string; // 7 días. Solo para refresh y logout
  userInfo: UserInfo;
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
