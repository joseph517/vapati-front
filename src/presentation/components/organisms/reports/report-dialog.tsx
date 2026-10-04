"use client";

import { useEffect, useState, type FormEvent } from "react";
import type {
  ReportReason,
  ReportTarget,
} from "@/domain/reports/report.types";
import {
  buildReportRequest,
  toReportFailure,
} from "@/domain/reports/reports";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import { ReportDescriptionField } from "@/presentation/components/molecules/reports/report-description-field";
import { ReportReasonChips } from "@/presentation/components/molecules/reports/report-reason-chips";
import { ReportSubject } from "@/presentation/components/molecules/reports/report-subject";
import { ReportSuccessCard } from "@/presentation/components/molecules/reports/report-success-card";
import { Button } from "@/presentation/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { useReportActions } from "@/presentation/hooks/reports/use-report-actions";
import {
  REPORT_DUPLICATE_TEXT,
  REPORT_LIMIT_TEXT,
  REPORT_NOT_FOUND_TEXTS,
  REPORT_TITLES,
} from "@/presentation/utils/report-texts";

type ReportPhase =
  | "form"
  | "sending"
  | "success"
  | "duplicate"
  | "limit"
  | "notFound";

type ReportFieldErrors = { reason?: string; description?: string };

// Report a campaign, a publication or a user. The caller keeps `target` while
// the dialog closes, so its content does not change during the animation.
export function ReportDialog({
  open,
  onOpenChange,
  target,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  target: ReportTarget;
}) {
  const reportActions = useReportActions();
  const [phase, setPhase] = useState<ReportPhase>("form");
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ReportFieldErrors>({});

  // Full reset on open: the same dialog is reopened on the same page.
  useEffect(() => {
    if (open) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setPhase("form");
      setReason(null);
      setDescription("");
      setError(null);
      setFieldErrors({});
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open]);

  const sending = phase === "sending";
  const editing = phase === "form" || sending;

  // Esc, outside click, "×" and "Cancelar" are all ignored while sending.
  function handleOpenChange(nextOpen: boolean) {
    if (sending) return;
    onOpenChange(nextOpen);
  }

  function handleReasonChange(value: ReportReason) {
    setReason(value);
    setError(null);
    setFieldErrors((current) => ({ ...current, reason: undefined }));
  }

  function handleDescriptionChange(value: string) {
    setDescription(value);
    setError(null);
    setFieldErrors((current) => ({ ...current, description: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!reason || sending) return;

    setPhase("sending");
    setError(null);
    setFieldErrors({});
    try {
      await reportActions.create(
        buildReportRequest(target, reason, description)
      );
      setPhase("success");
    } catch (err) {
      const failure = toReportFailure(err);
      switch (failure.kind) {
        case "duplicate":
        case "limit":
        case "notFound":
          setPhase(failure.kind);
          break;
        case "fields":
          setFieldErrors({
            reason: failure.reason,
            description: failure.description,
          });
          setError(failure.other ?? null);
          setPhase("form");
          break;
        case "error":
          setError(failure.message);
          setPhase("form");
          break;
      }
    }
  }

  const noticeText =
    phase === "duplicate"
      ? REPORT_DUPLICATE_TEXT
      : phase === "limit"
        ? REPORT_LIMIT_TEXT
        : phase === "notFound"
          ? REPORT_NOT_FOUND_TEXTS[target.type]
          : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[460px] gap-4 overflow-y-auto rounded-2xl border border-input bg-card p-[26px] shadow-[0_24px_60px_rgba(38,32,27,0.22)] sm:max-w-[460px]"
      >
        <DialogHeader className="flex-row items-start justify-between gap-4 space-y-0">
          <DialogTitle className="font-serif text-2xl font-medium tracking-[-0.01em] text-foreground">
            {phase === "success"
              ? "Gracias, recibimos tu reporte"
              : REPORT_TITLES[target.type]}
          </DialogTitle>
          <button
            type="button"
            aria-label="Cerrar"
            disabled={sending}
            onClick={() => handleOpenChange(false)}
            className="text-xl leading-none text-[var(--ink-faint)] hover:text-foreground disabled:opacity-50"
          >
            ×
          </button>
        </DialogHeader>

        {phase === "success" ? (
          <DialogDescription asChild>
            <div>
              <ReportSuccessCard />
            </div>
          </DialogDescription>
        ) : (
          <DialogDescription asChild>
            <div className="-mt-2">
              <ReportSubject target={target} />
            </div>
          </DialogDescription>
        )}

        {noticeText && <NoticeAlert role="status">{noticeText}</NoticeAlert>}

        {editing ? (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
          >
            {error && <NoticeAlert tone="danger">{error}</NoticeAlert>}

            <ReportReasonChips
              value={reason}
              onChange={handleReasonChange}
              disabled={sending}
              error={fieldErrors.reason}
            />

            <ReportDescriptionField
              value={description}
              onChange={handleDescriptionChange}
              disabled={sending}
              error={fieldErrors.description}
            />

            <p className="text-[12.5px] leading-[1.5] text-[var(--ink-faint)]">
              El equipo de VaPaTi revisa cada reporte. Después de enviarlo no
              vas a poder ver su estado.
            </p>

            <div className="flex flex-wrap justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                disabled={sending}
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!reason || sending}
                className="font-semibold"
              >
                Enviar reporte
                {sending && (
                  <span className="animate-pulse text-[13px] font-normal opacity-85">
                    enviando…
                  </span>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
