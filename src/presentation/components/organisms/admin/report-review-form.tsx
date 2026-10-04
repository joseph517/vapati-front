"use client";

import { useState, type FormEvent } from "react";
import {
  ALLOWED_ACTIONS,
  buildReviewRequest,
  DEFAULT_SANCTION_REASONS,
  isIrreversibleAction,
  isReviewConflict,
  isSanctionAction,
  REVIEW_TARGET_STATUSES,
  validateReviewForm,
  type ReviewFormErrors,
  type ReviewFormValues,
} from "@/domain/admin/admin-reports";
import type {
  ActionTaken,
  ReportDTO,
  ReviewTargetStatus,
} from "@/domain/reports/report.types";
import { toQueryError } from "@/domain/shared/errors";
import { FieldError } from "@/presentation/components/atoms/field-error";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import {
  ReviewActionOptions,
} from "@/presentation/components/molecules/admin/review-action-options";
import {
  ReviewNotesField,
} from "@/presentation/components/molecules/admin/review-notes-field";
import { ChipRadioGroup } from "@/presentation/components/molecules/chip-radio-group";
import {
  ConfirmDeleteDialog,
} from "@/presentation/components/molecules/confirm-delete-dialog";
import { Button } from "@/presentation/components/ui/button";
import { useAdminReportActions } from "@/presentation/hooks/admin/use-admin-report-actions";
import {
  REVIEW_CONFIRM_NOTE,
  REVIEW_CONFIRM_REASON_LABEL,
  REVIEW_CONFIRM_TITLE,
  REVIEW_STATUS_HELP,
  REVIEW_STATUS_OPTION_LABELS,
  reviewConfirmTexts,
} from "@/presentation/utils/admin-report-texts";
import { FIELD_LABEL_CLASSES } from "@/presentation/utils/form-classes";

const STATUS_OPTIONS = REVIEW_TARGET_STATUSES.map((status) => ({
  value: status,
  label: REVIEW_STATUS_OPTION_LABELS[status],
}));

// Only for PENDING or UNDER_REVIEW reports. The page remounts it (key = reviewedAt)
// after each save, so it starts over with the new notes.
export function ReportReviewForm({
  report,
  onSaved,
  onConflict,
  onSubmitAttempt,
}: {
  report: ReportDTO;
  onSaved: (report: ReportDTO) => void;
  onConflict: (message: string) => void;
  onSubmitAttempt: () => void;
}) {
  const reportActions = useAdminReportActions();
  const [values, setValues] = useState<ReviewFormValues>({
    status: null,
    actionTaken: null,
    adminNotes: report.adminNotes ?? "",
  });
  const [errors, setErrors] = useState<ReviewFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const entityType = report.reportedEntityType;
  const sanction = isSanctionAction(values.actionTaken)
    ? (values.actionTaken as "USER_BANNED" | "USER_SUSPENDED")
    : null;

  function handleStatusChange(status: ReviewTargetStatus) {
    setValues((current) => ({
      ...current,
      status,
      actionTaken: status === "RESOLVED" ? current.actionTaken : null,
    }));
    setErrors({});
    setFormError(null);
  }

  function handleActionChange(actionTaken: ActionTaken) {
    setValues((current) => ({ ...current, actionTaken }));
    setErrors((current) => ({ ...current, actionTaken: undefined, adminNotes: undefined }));
  }

  function handleNotesChange(adminNotes: string) {
    setValues((current) => ({ ...current, adminNotes }));
    setErrors((current) => ({ ...current, adminNotes: undefined }));
  }

  async function send() {
    setBusy(true);
    setFormError(null);
    try {
      const saved = await reportActions.review(report.id, buildReviewRequest(values));
      onSaved(saved);
    } catch (err) {
      const error = toQueryError(err);
      if (isReviewConflict(error.status)) {
        onConflict(error.message);
      } else {
        setFormError(error.message);
      }
    } finally {
      setBusy(false);
    }
  }

  // A 409 closes the dialog and goes to the page. Any other error is rethrown
  // so the dialog shows it and re-enables its buttons.
  async function handleConfirm() {
    try {
      const saved = await reportActions.review(report.id, buildReviewRequest(values));
      setConfirmOpen(false);
      onSaved(saved);
    } catch (err) {
      const error = toQueryError(err);
      if (isReviewConflict(error.status)) {
        setConfirmOpen(false);
        onConflict(error.message);
        return;
      }
      throw err;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    onSubmitAttempt();
    const nextErrors = validateReviewForm(values);
    setErrors(nextErrors);
    setFormError(null);
    if (Object.keys(nextErrors).length > 0) return;
    if (values.status === "RESOLVED" && isIrreversibleAction(values.actionTaken)) {
      setConfirmOpen(true);
      return;
    }
    void send();
  }

  const confirmTexts =
    values.actionTaken !== null
      ? reviewConfirmTexts(values.actionTaken, entityType, report.reportedEntityId)
      : null;
  const trimmedNotes = values.adminNotes.trim();

  // The dialog stays outside the form: its events would bubble through the portal.
  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        className="mt-[18px] flex flex-col gap-[22px] rounded-xl border border-border bg-card p-6"
      >
        <h3 className="font-serif text-lg leading-[1.2] font-medium text-foreground">
          Revisar reporte
        </h3>

        <div className="flex flex-col gap-2">
          <span aria-hidden className={`${FIELD_LABEL_CLASSES} leading-none`}>
            Nuevo estado
          </span>
          <ChipRadioGroup
            label="Nuevo estado"
            options={STATUS_OPTIONS}
            value={values.status}
            onChange={handleStatusChange}
            disabled={busy}
            chipClassName="px-3.5"
          />
          <p className="text-[12.5px] text-[var(--ink-faint)]">{REVIEW_STATUS_HELP}</p>
          <FieldError message={errors.status} />
        </div>

        {values.status === "RESOLVED" && (
          <div className="flex flex-col gap-2">
            <span aria-hidden className={`${FIELD_LABEL_CLASSES} leading-none`}>
              Acción
            </span>
            <ReviewActionOptions
              label="Acción"
              actions={ALLOWED_ACTIONS[entityType]}
              entityType={entityType}
              value={values.actionTaken}
              onChange={handleActionChange}
              disabled={busy}
            />
            <FieldError message={errors.actionTaken} />
          </div>
        )}

        <ReviewNotesField
          value={values.adminNotes}
          onChange={handleNotesChange}
          sanction={sanction}
          disabled={busy}
          error={errors.adminNotes}
        />

        {formError && <NoticeAlert tone="danger">{formError}</NoticeAlert>}

        <div className="flex items-center gap-3 border-t border-[var(--divider)] pt-[18px]">
          <Button type="submit" disabled={busy} className="font-semibold">
            Guardar revisión
            {busy && (
              <span className="animate-pulse text-[13px] font-normal opacity-85">
                guardando…
              </span>
            )}
          </Button>
        </div>
      </form>

        {confirmTexts && (
          <ConfirmDeleteDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title={REVIEW_CONFIRM_TITLE}
            description={confirmTexts.description}
            note={REVIEW_CONFIRM_NOTE}
            confirmLabel={confirmTexts.confirmLabel}
            progressLabel="guardando…"
            onConfirm={handleConfirm}
          >
            {sanction && (
              <div className="flex flex-col gap-1.5">
                <span className={`${FIELD_LABEL_CLASSES} leading-none`}>
                  {REVIEW_CONFIRM_REASON_LABEL}
                </span>
                <p
                  className={
                    trimmedNotes
                      ? "max-h-40 overflow-auto rounded-lg border border-input bg-white px-3 py-2.5 text-sm leading-[1.55] whitespace-pre-wrap [overflow-wrap:anywhere] text-foreground"
                      : "max-h-40 overflow-auto rounded-lg border border-input bg-white px-3 py-2.5 text-sm leading-[1.55] text-[var(--ink-faint)]"
                  }
                >
                  {trimmedNotes || DEFAULT_SANCTION_REASONS[sanction]}
                </p>
              </div>
            )}
          </ConfirmDeleteDialog>
        )}
    </>
  );
}
