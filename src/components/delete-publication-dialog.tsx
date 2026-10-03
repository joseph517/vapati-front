"use client";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import type { PublicationResponseDTO } from "@/domain/publications/publication.types";
import {
  isPublicationNotFoundError,
  publicationExcerpt,
} from "@/domain/publications/publications";
import { usePublicationActions } from "@/presentation/hooks/publications/use-publication-actions";

// A 404 means it was already deleted (e.g. in another tab), so it counts as deleted.
// Any other error stays in the dialog and can be retried. The caller closes it on `onDeleted`.
export function DeletePublicationDialog({
  open,
  onOpenChange,
  publication,
  onDeleted,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  publication: PublicationResponseDTO;
  onDeleted: () => void;
}) {
  const publicationActions = usePublicationActions();

  async function handleConfirm() {
    try {
      await publicationActions.remove(publication.id);
    } catch (err) {
      if (!isPublicationNotFoundError(err)) throw err;
    }
    onDeleted();
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Vas a borrar esta novedad"
      description={
        <span className="whitespace-pre-wrap [overflow-wrap:anywhere]">
          «{publicationExcerpt(publication.description)}»
        </span>
      }
      note="Deja de verse en la campaña. No se puede deshacer."
      confirmLabel="Borrar novedad"
      onConfirm={handleConfirm}
    />
  );
}
