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
