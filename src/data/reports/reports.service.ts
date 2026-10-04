import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  CreateReportRequest,
  ReportResponseDTO,
} from "@/domain/reports/report.types";

// No GET in this module, so there are no keys
export const reportsService = {
  // The reporter comes from the token. The report stays PENDING
  create: (body: CreateReportRequest) =>
    apiFetch<ReportResponseDTO>("/api/reports", {
      method: "POST",
      body,
      ...auth(),
    }),
};
