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

// Moderation (admin panel)

export type ReportStatus = "PENDING" | "UNDER_REVIEW" | "RESOLVED" | "REJECTED";
export type ReviewTargetStatus = Exclude<ReportStatus, "PENDING">;

export type ActionTaken =
  | "NO_ACTION"
  | "WARNING_SENT"
  | "CONTENT_REMOVED"
  | "USER_SUSPENDED"
  | "USER_BANNED"
  | "OTHER";

// GET /api/reports: any other value responds 400
export type ReportSortBy = "createdAt" | "status";

export type ReportDTO = {
  id: number;
  reporterId: number | null; // null if the reporter deleted their account
  reporterUsername: string | null;
  reporterEmail: string | null;
  reportedEntityType: ReportedEntityType;
  reportedEntityId: number;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  reviewedById: number | null; // null until reviewed, or if that ADMIN deleted their account
  reviewedByUsername: string | null;
  reviewedAt: string | null; // LocalDateTime ISO, no zone
  adminNotes: string | null;
  actionTaken: ActionTaken | null;
  createdAt: string;
  updatedAt: string;
};

// PUT /api/reports/{id}/review
export type ReviewReportRequest = {
  status: ReviewTargetStatus;
  adminNotes?: string; // trimmed, omitted when empty. Sanction reason (max 500)
  actionTaken?: ActionTaken; // only with RESOLVED
};

// GET /api/reports/stats: the three Records bring every key, also with 0
export type ReportStatsDTO = {
  totalReports: number;
  reportsByStatus: Record<ReportStatus, number>;
  reportsByReason: Record<ReportReason, number>;
  reportsByEntityType: Record<ReportedEntityType, number>;
  pendingReports: number;
  resolvedReports: number;
  rejectedReports: number;
};
