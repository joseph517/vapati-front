// GET /api/campaigns/{campaignId}/publications returns an array of these, newest first.
export type PublicationResponseDTO = {
  id: number;
  campaignId: number;
  userId: number;
  firstName: string;
  lastName: string;
  userName: string;
  description: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime. Not shown (no editing yet)
};

// POST /api/campaigns/{campaignId}/publications
export type CreatePublicationRequest = {
  description: string; // trimmed, 1..255
};

// DELETE /api/publications/{publicationId}
export type DeletePublicationResponse = {
  message: string;
  publicationId: number;
};
