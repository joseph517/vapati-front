export type ReportedEntityType = "USER" | "PUBLICATION" | "CAMPAIGN";

export type ReportReason =
  | "SPAM"
  | "INAPPROPRIATE_CONTENT"
  | "HARASSMENT"
  | "FRAUD"
  | "MISINFORMATION"
  | "IMPERSONATION"
  | "OTHER";

// POST /api/reports
export type CreateReportRequest = {
  reportedEntityType: ReportedEntityType;
  reportedEntityId: number; // > 0
  reason: ReportReason;
  description?: string; // trimmed, max 1000. Omitted when empty after trim
};

export type ReportResponseDTO = {
  message: string; // "Report submitted successfully"
  success: true;
};

// What the dialog reports and how it names it.
export type ReportTarget = {
  type: ReportedEntityType;
  id: number;
  displayName: string; // campaign name, or full name of the user / publication author
  displayHandle?: string; // userName, for USER and PUBLICATION
  excerpt?: string; // publication text, PUBLICATION only
};

// Result of a failed POST, as the dialog shows it.
export type ReportFailure =
  | { kind: "duplicate" } // 409
  | { kind: "limit" } // 400 with the daily-limit message
  | { kind: "notFound" } // 404
  | { kind: "fields"; reason?: string; description?: string; other?: string } // 400 with fields
  | { kind: "error"; message: string }; // anything else, via toErrorMessage
