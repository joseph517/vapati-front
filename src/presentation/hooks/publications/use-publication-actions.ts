import { publicationsService } from "@/data/publications/publications.service";

// Module-level, so the object and its functions are the same on every render
const publicationActions = {
  create: publicationsService.create,
  remove: publicationsService.remove,
};

export function usePublicationActions() {
  return publicationActions;
}
