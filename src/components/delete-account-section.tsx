"use client";

import { useState } from "react";
import { DangerOutlineButton } from "@/components/danger-outline-button";
import { DeleteAccountDialog } from "@/components/delete-account-dialog";

// "Borrar cuenta" footer of /profile, with its confirmation dialog
export function DeleteAccountSection() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="mt-11 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[var(--divider)] pt-5">
      <div className="min-w-[260px] flex-1">
        <p className="text-[15px] font-medium text-foreground">Borrar cuenta</p>
        <p className="mt-0.5 text-[13.5px] text-muted-foreground">
          Tus campañas se cierran y tus donaciones quedan sin tu nombre. Antes
          de borrar te pedimos confirmar.
        </p>
      </div>
      <DangerOutlineButton type="button" onClick={() => setDialogOpen(true)}>
        Borrar cuenta
      </DangerOutlineButton>
      <DeleteAccountDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
