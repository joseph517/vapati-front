import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  CreatePublicationRequest,
  DeletePublicationResponse,
  PublicationResponseDTO,
} from "@/domain/publications/publication.types";

type CampaignId = string | number;

const keys = {
  byCampaign: (campaignId: CampaignId) =>
    `/api/campaigns/${campaignId}/publications`,
};

export const publicationsService = {
  keys,
  listByCampaign: (campaignId: CampaignId) =>
    apiFetch<PublicationResponseDTO[]>(keys.byCampaign(campaignId), auth()),
  create: (campaignId: CampaignId, body: CreatePublicationRequest) =>
    apiFetch<PublicationResponseDTO>(keys.byCampaign(campaignId), {
      method: "POST",
      body,
      ...auth(),
    }),
  remove: (publicationId: number) =>
    apiFetch<DeletePublicationResponse>(`/api/publications/${publicationId}`, {
      method: "DELETE",
      ...auth(),
    }),
};
