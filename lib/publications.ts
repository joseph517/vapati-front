import { ApiClientError } from "@/lib/api";
import type { CampaignResponseDTO, PublicationResponseDTO } from "@/lib/types";

export const PUBLICATION_MAX_LENGTH = 255;
export const PUBLICATION_COUNTER_WARNING_AT = 230; // counter switches to the notice color

const EXCERPT_MAX_LENGTH = 120;

// Composer only for the owner, and not while the campaign is CLOSED.
export function canPublish(
  campaign: CampaignResponseDTO,
  userId: number | undefined
): boolean {
  return userId === campaign.userId && campaign.status !== "CLOSED";
}

export function publicationAuthorName(
  publication: PublicationResponseDTO
): string {
  return `${publication.firstName} ${publication.lastName}`;
}

// Shown in the delete dialog.
export function publicationExcerpt(description: string): string {
  if (description.length <= EXCERPT_MAX_LENGTH) return description;
  return `${description.slice(0, EXCERPT_MAX_LENGTH).trimEnd()}…`;
}

export function publicationsEmptyText(
  isOwner: boolean,
  isClosed: boolean
): string {
  if (!isOwner) return "Esta campaña todavía no publicó novedades.";
  if (isClosed) return "Esta campaña no tiene novedades.";
  return "Todavía no contaste ninguna novedad. Escribí la primera: un avance o un agradecimiento para quienes apoyan la campaña.";
}

// Message for the description field of a 400 "Validation failed".
export function publicationDescriptionError(err: unknown): string | null {
  if (!(err instanceof ApiClientError) || err.status !== 400) return null;
  return err.fields?.description ?? null;
}

// A 400 that is not from validation: the campaign rejected the publication
// (closed meanwhile). The exact message is unknown, so only the shape is checked.
export function isPublicationRejectedByCampaign(err: unknown): boolean {
  return (
    err instanceof ApiClientError &&
    err.status === 400 &&
    !err.fields?.description
  );
}

export function isPublicationNotFoundError(err: unknown): boolean {
  return err instanceof ApiClientError && err.status === 404;
}
