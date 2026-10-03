import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  CampaignResponseDTO,
  CampaignStatusHistoryResponseDTO,
  CreateCampaignRequest,
  CreateCampaignResponse,
  DeleteCampaignResponse,
  MyCampaignsResponse,
  UpdateCampaignRequest,
} from "@/domain/campaigns/campaign.types";

type CampaignId = string | number;

// Each key is the GET path, so it is also the useApiQuery identity.
const keys = {
  // Without a category (null or 0) the whole list is requested
  list: (categoryId: number | null) =>
    `/api/campaigns/list${categoryId ? `?categoryId=${categoryId}` : ""}`,
  detail: (id: CampaignId) => `/api/campaigns/${id}`,
  mine: () => "/api/campaigns/my-campaigns",
  statusHistory: (id: CampaignId) => `/api/campaigns/${id}/status-history`,
};

export const campaignsService = {
  keys,
  list: (categoryId: number | null) =>
    apiFetch<CampaignResponseDTO[]>(keys.list(categoryId), auth()),
  getById: (id: CampaignId) =>
    apiFetch<CampaignResponseDTO>(keys.detail(id), auth()),
  listMine: () => apiFetch<MyCampaignsResponse>(keys.mine(), auth()),
  statusHistory: (id: CampaignId) =>
    apiFetch<CampaignStatusHistoryResponseDTO[]>(keys.statusHistory(id), auth()),
  create: (body: CreateCampaignRequest) =>
    apiFetch<CreateCampaignResponse>("/api/campaigns/create", {
      method: "POST",
      body,
      ...auth(),
    }),
  update: (id: CampaignId, body: UpdateCampaignRequest) =>
    apiFetch<CampaignResponseDTO>(`/api/campaigns/${id}`, {
      method: "PUT",
      body,
      ...auth(),
    }),
  remove: (id: CampaignId) =>
    apiFetch<DeleteCampaignResponse>(`/api/campaigns/${id}`, {
      method: "DELETE",
      ...auth(),
    }),
  close: (id: CampaignId) =>
    apiFetch(`/api/campaigns/${id}/close`, { method: "PUT", ...auth() }),
  activate: (id: CampaignId) =>
    apiFetch(`/api/campaigns/${id}/activate`, { method: "PUT", ...auth() }),
};
