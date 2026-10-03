import type { CategoryDTO } from "@/domain/categories/category.types";

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
