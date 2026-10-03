"use client";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { apiFetch } from "@/lib/api";
import {
  isPublicationNotFoundError,
  publicationExcerpt,
} from "@/lib/publications";
import { useAuthStore } from "@/lib/store/auth-store";
import type { DeletePublicationResponse, PublicationResponseDTO } from "@/lib/types";

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
  const accessToken = useAuthStore((state) => state.accessToken);

  async function handleConfirm() {
    try {
      await apiFetch<DeletePublicationResponse>(
        `/api/publications/${publication.id}`,
        { method: "DELETE", accessToken }
      );
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
