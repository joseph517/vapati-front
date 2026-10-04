import type {
  CreateReportRequest,
  ReportFailure,
  ReportReason,
  ReportTarget,
} from "@/domain/reports/report.types";
import { ApiClientError, toErrorMessage } from "@/domain/shared/errors";

export const REPORT_REASONS: ReportReason[] = [
  "SPAM",
  "INAPPROPRIATE_CONTENT",
  "HARASSMENT",
  "FRAUD",
  "MISINFORMATION",
  "IMPERSONATION",
  "OTHER",
];

export const REPORT_DESCRIPTION_MAX_LENGTH = 1000;
export const REPORT_COUNTER_WARNING_AT = 900; // counter switches to the notice color

const DAILY_LIMIT_MESSAGE_PREFIX =
  "You have reached the maximum number of reports";

// Only on someone else's entity, and only with a session.
export function canReport(
  ownerId: number,
  viewerId: number | undefined
): boolean {
  return viewerId !== undefined && viewerId !== ownerId;
}

// Trims the description and omits it when it ends up empty.
export function buildReportRequest(
  target: ReportTarget,
  reason: ReportReason,
  description: string
): CreateReportRequest {
  const trimmed = description.trim();
  return {
    reportedEntityType: target.type,
    reportedEntityId: target.id,
    reason,
    ...(trimmed ? { description: trimmed } : {}),
  };
}

// 409 and 404 by status. The daily limit by its message prefix, like the
// blocked-account 403. reason and description go to their field; any other
// field (type or id, not typed by the user) goes to `other`.
export function toReportFailure(err: unknown): ReportFailure {
  if (!(err instanceof ApiClientError)) {
    return { kind: "error", message: toErrorMessage(err) };
  }
  if (err.status === 409) return { kind: "duplicate" };
  if (err.status === 404) return { kind: "notFound" };
  if (err.status === 400) {
    if (err.message.startsWith(DAILY_LIMIT_MESSAGE_PREFIX)) {
      return { kind: "limit" };
    }
    if (err.fields) {
      const { reason, description, ...rest } = err.fields;
      const other = Object.values(rest)[0];
      if (reason || description || other) {
        return { kind: "fields", reason, description, other };
      }
    }
  }
  return { kind: "error", message: toErrorMessage(err) };
}
