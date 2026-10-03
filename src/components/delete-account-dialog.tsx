"use client";

import { ConfirmDeleteDialog } from "@/components/confirm-delete-dialog";
import { useAuthStore } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type { DeleteUserResponse } from "@/domain/users/user.types";
import { revokeRefreshToken } from "@/lib/session";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({
  open,
  onOpenChange,
}: DeleteAccountDialogProps) {
  const accessToken = useAuthStore((state) => state.accessToken);

  async function handleConfirm() {
    await apiFetch<DeleteUserResponse>("/api/users/delete", {
      method: "DELETE",
      accessToken,
    });
    // Revoked so the old tokens don't work again if the account is restored.
    await revokeRefreshToken();
    // The protected layout redirects once the session is cleared.
    useAuthStore.getState().clearSession("/login?flash=account-deleted");
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
