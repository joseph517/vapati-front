"use client";

import {
  ConfirmDeleteDialog,
} from "@/presentation/components/molecules/confirm-delete-dialog";
import { useAuthActions } from "@/presentation/hooks/auth/use-auth-actions";
import { useSessionActions } from "@/presentation/hooks/auth/use-session-actions";
import { useAccountActions } from "@/presentation/hooks/users/use-account-actions";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const { deleteAccount } = useAccountActions();
  const { revokeRefreshToken } = useAuthActions();
  const { clearSession } = useSessionActions();

  async function handleConfirm() {
    await deleteAccount();
    // Revoked so the old tokens don't work again if the account is restored.
    await revokeRefreshToken();
    // The protected layout redirects once the session is cleared.
    clearSession("/login?flash=account-deleted");
  }

  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Vas a borrar tu cuenta"
      description="Tu cuenta se borra. Tus campañas se cierran y dejan de verse, y tus donaciones se conservan en las campañas, sin tu nombre."
      note="Si más adelante volvés a entrar con tu email y contraseña, la cuenta se restaura. Las campañas siguen cerradas y las podés reactivar."
      confirmLabel="Borrar cuenta"
      onConfirm={handleConfirm}
    />
  );
}
