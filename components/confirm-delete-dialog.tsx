"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiClientError } from "@/lib/api";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  note: ReactNode;
  confirmLabel: string;
  // If it throws, the dialog shows the error and re-enables. If it resolves, the dialog
  // stays in "borrando…", because the caller navigates away.
  onConfirm: () => Promise<void>;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  note,
  confirmLabel,
  onConfirm,
}: ConfirmDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError(null);
    }
  }, [open]);

  // Esc, outside click, "×" and "Cancelar" are all ignored while deleting.
  function handleOpenChange(nextOpen: boolean) {
    if (deleting) return;
    onOpenChange(nextOpen);
  }

  async function handleConfirm() {
    setError(null);
    setDeleting(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(
        err instanceof ApiClientError
          ? err.message
          : "Ocurrió un error inesperado. Intentá de nuevo."
      );
      setDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        role="alertdialog"
        className="w-[calc(100%-2rem)] max-w-[460px] gap-4 rounded-2xl border border-input bg-card p-[26px] shadow-[0_24px_60px_rgba(38,32,27,0.22)] sm:max-w-[460px]"
      >
        <DialogHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <DialogTitle className="font-serif text-2xl font-medium tracking-[-0.01em] text-foreground">
            {title}
          </DialogTitle>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={deleting}
            onClick={() => handleOpenChange(false)}
            className="text-xl leading-none text-[var(--ink-faint)] hover:text-foreground disabled:opacity-50"
          >
            ×
          </button>
        </DialogHeader>

        <div>
          <DialogDescription className="text-[15px] leading-[1.55] text-[var(--ink-body)]">
            {description}
          </DialogDescription>
          <p className="mt-2 text-[13.5px] text-muted-foreground">{note}</p>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="border-[var(--danger-border)] bg-[var(--danger-bg)]"
          >
            <AlertDescription className="text-[13.5px]">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            disabled={deleting}
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            disabled={deleting}
            onClick={handleConfirm}
            className="bg-destructive font-semibold text-primary-foreground hover:bg-[var(--destructive-hover)]"
          >
            {confirmLabel}
            {deleting && (
              <span className="animate-pulse text-[13px] font-normal opacity-85">
                borrando…
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
