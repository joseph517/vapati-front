import type {
  ActionTaken,
  ReportedEntityType,
  ReportStatus,
  ReviewReportRequest,
  ReviewTargetStatus,
} from "@/domain/reports/report.types";

export const REVIEWABLE_STATUSES: readonly ReportStatus[] = [
  "PENDING",
  "UNDER_REVIEW",
];

export const REVIEW_TARGET_STATUSES: readonly ReviewTargetStatus[] = [
  "UNDER_REVIEW",
  "RESOLVED",
  "REJECTED",
];

// Actions the backend accepts to resolve each type. NO_ACTION is never valid with RESOLVED.
export const ALLOWED_ACTIONS: Record<ReportedEntityType, readonly ActionTaken[]> = {
  USER: ["WARNING_SENT", "USER_SUSPENDED", "USER_BANNED", "OTHER"],
  PUBLICATION: ["WARNING_SENT", "CONTENT_REMOVED", "OTHER"],
  CAMPAIGN: ["WARNING_SENT", "CONTENT_REMOVED", "OTHER"],
};

// They need a confirmation: none of them can be undone
export const IRREVERSIBLE_ACTIONS: readonly ActionTaken[] = [
  "USER_SUSPENDED",
  "USER_BANNED",
  "CONTENT_REMOVED",
];

// The account is blocked and adminNotes is the reason the user sees
export const SANCTION_ACTIONS: readonly ActionTaken[] = [
  "USER_SUSPENDED",
  "USER_BANNED",
];

export const SANCTION_REASON_MAX_LENGTH = 500;
export const SANCTION_REASON_WARNING_AT = 450; // counter switches to the notice color

// What the backend stores when a sanction has no notes
export const DEFAULT_SANCTION_REASONS: Record<
  "USER_BANNED" | "USER_SUSPENDED",
  string
> = {
  USER_BANNED: "Banned by admin",
  USER_SUSPENDED: "Suspended by admin",
};

export const REVIEW_STATUS_REQUIRED_MESSAGE = "Elegí un estado.";
export const REVIEW_ACTION_REQUIRED_MESSAGE = "Elegí una acción.";
export const SANCTION_REASON_TOO_LONG_MESSAGE =
  "El motivo de la sanción no puede superar los 500 caracteres.";

export function canReview(status: ReportStatus): boolean {
  return REVIEWABLE_STATUSES.includes(status);
}

export function isIrreversibleAction(action: ActionTaken | null): boolean {
  return action !== null && IRREVERSIBLE_ACTIONS.includes(action);
}

export function isSanctionAction(action: ActionTaken | null): boolean {
  return action !== null && SANCTION_ACTIONS.includes(action);
}

export type ReviewFormValues = {
  status: ReviewTargetStatus | null;
  actionTaken: ActionTaken | null;
  adminNotes: string;
};

export type ReviewFormErrors = {
  status?: string;
  actionTaken?: string;
  adminNotes?: string;
};

// Only the first failing rule. The notes length only matters for a sanction,
// and it is measured trimmed, like what is sent.
export function validateReviewForm(values: ReviewFormValues): ReviewFormErrors {
  if (values.status === null) {
    return { status: REVIEW_STATUS_REQUIRED_MESSAGE };
  }
  if (values.status === "RESOLVED" && values.actionTaken === null) {
    return { actionTaken: REVIEW_ACTION_REQUIRED_MESSAGE };
  }
  if (
    values.status === "RESOLVED" &&
    isSanctionAction(values.actionTaken) &&
    values.adminNotes.trim().length > SANCTION_REASON_MAX_LENGTH
  ) {
    return { adminNotes: SANCTION_REASON_TOO_LONG_MESSAGE };
  }
  return {};
}

// adminNotes is never sent empty: without notes the backend stores its default reason.
// actionTaken only goes with RESOLVED. Call it after validateReviewForm.
export function buildReviewRequest(
  values: ReviewFormValues
): ReviewReportRequest {
  if (values.status === null) {
    throw new Error("buildReviewRequest called without a status");
  }
  const adminNotes = values.adminNotes.trim();
  return {
    status: values.status,
    ...(adminNotes ? { adminNotes } : {}),
    ...(values.status === "RESOLVED" && values.actionTaken !== null
      ? { actionTaken: values.actionTaken }
      : {}),
  };
}

// 404, or 400 with a non-numeric id
export function isReportNotFound(status: number): boolean {
  return status === 404 || status === 400;
}

// The report was already resolved or rejected
export function isReviewConflict(status: number): boolean {
  return status === 409;
}
