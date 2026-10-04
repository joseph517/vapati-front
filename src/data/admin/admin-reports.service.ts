import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import {
  ADMIN_REPORTS_PAGE_SIZE,
  type AdminReportsQuery,
} from "@/domain/admin/admin-reports-query";
import type {
  ReportDTO,
  ReportStatsDTO,
  ReviewReportRequest,
} from "@/domain/reports/report.types";
import type { SpringPage } from "@/domain/shared/shared.types";

const keys = {
  stats: () => "/api/reports/stats",
  paginated: (query: AdminReportsQuery) => {
    const params = new URLSearchParams({
      page: String(query.page),
      size: String(ADMIN_REPORTS_PAGE_SIZE),
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    });
    return `/api/reports?${params.toString()}`;
  },
  // The route's id goes as is: a non-numeric one responds 400
  detail: (id: string) => `/api/reports/${id}`,
};

// ADMIN only: the backend answers 403 to anyone else
export const adminReportsService = {
  keys,
  stats: () => apiFetch<ReportStatsDTO>(keys.stats(), auth()),
  listPaginated: (query: AdminReportsQuery) =>
    apiFetch<SpringPage<ReportDTO>>(keys.paginated(query), auth()),
  detail: (id: string) => apiFetch<ReportDTO>(keys.detail(id), auth()),
  review: (id: number, body: ReviewReportRequest) =>
    apiFetch<ReportDTO>(`/api/reports/${id}/review`, {
      method: "PUT",
      body,
      ...auth(),
    }),
};
