"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toErrorMessage } from "@/domain/shared/errors";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import { Alert, AlertDescription } from "@/presentation/components/ui/alert";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  note: ReactNode;
  confirmLabel: string;
  // Shown next to the confirm label while onConfirm runs. Defaults to "borrando…".
  progressLabel?: string;
  // Extra content between the note and the alerts.
  children?: ReactNode;
  // If it throws, the dialog shows the error and re-enables. If it resolves, the dialog
  // stays in progress until the caller navigates away or closes it.
  onConfirm: () => Promise<void>;
  // If it returns a message for the error thrown by onConfirm, the dialog enters
  // "blocked" mode: a notice with that message and a single "Cerrar" button.
  getBlockedMessage?: (err: unknown) => string | null;
}

export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  note,
  confirmLabel,
  progressLabel = "borrando…",
  children,
  onConfirm,
  getBlockedMessage,
}: ConfirmDeleteDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState<string | null>(null);

  // Full reset on open: a caller that closes the dialog without navigating away
  // reopens it on the same page.
  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setError(null);
      setBlocked(null);
      setDeleting(false);
      /* eslint-enable react-hooks/set-state-in-effect */
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
      const blockedMessage = getBlockedMessage?.(err) ?? null;
      if (blockedMessage) {
        setBlocked(blockedMessage);
      } else {
        setError(toErrorMessage(err));
      }
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

        {children}

        {blocked && <NoticeAlert>{blocked}</NoticeAlert>}

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
          {blocked ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cerrar
            </Button>
          ) : (
            <>
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
                    {progressLabel}
                  </span>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
