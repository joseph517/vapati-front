"use client";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import {
  categoryDeleteBlockedMessage,
  isCategoryNotFoundError,
} from "@/domain/categories/category-form";
import type { CategoryDTO } from "@/domain/categories/category.types";
import { toErrorMessage } from "@/domain/shared/errors";
import { useAdminCategoryActions } from "@/presentation/hooks/admin/use-admin-category-actions";

// A rejected delete (400, the category is in use) leaves the dialog in blocked mode.
// A 404 goes to `onNotFound`; any other error stays in the dialog and can be retried.
// On success and on 404 the caller closes the dialog.
export function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  onMutationStart,
  onDeleted,
  onNotFound,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryDTO;
  onMutationStart: () => void;
  onDeleted: (category: CategoryDTO) => void;
  onNotFound: (message: string) => void;
}) {
  const categoryActions = useAdminCategoryActions();

  async function handleConfirm() {
    onMutationStart();
    try {
      await categoryActions.remove(category.id);
    } catch (err) {
      if (isCategoryNotFoundError(err)) {
        onNotFound(toErrorMessage(err));
        return;
      }
      throw err;
    }
    onDeleted(category);
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title={<>Vas a borrar «{category.name}»</>}
      description="Se borra para siempre. No se puede deshacer."
      note="Solo se puede borrar si ningún usuario la eligió como interés y si ninguna campaña queda sin categorías. Las campañas que tienen otras categorías la pierden."
      confirmLabel="Borrar categoría"
      onConfirm={handleConfirm}
      getBlockedMessage={categoryDeleteBlockedMessage}
    />
  );
}
