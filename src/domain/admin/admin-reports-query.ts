import type { ReportSortBy } from "@/domain/reports/report.types";
import type { SortDirection } from "@/domain/shared/shared.types";

export const ADMIN_REPORTS_PAGE_SIZE = 10;

export type AdminReportsQuery = {
  page: number; // >= 0
  sortBy: ReportSortBy;
  sortDirection: SortDirection;
};

const DEFAULT_QUERY: AdminReportsQuery = {
  page: 0,
  sortBy: "createdAt",
  sortDirection: "desc",
};

const SORT_BY_VALUES: readonly ReportSortBy[] = ["createdAt", "status"];
const SORT_DIRECTION_VALUES: readonly SortDirection[] = ["asc", "desc"];

function isSortBy(value: string | null): value is ReportSortBy {
  return SORT_BY_VALUES.includes(value as ReportSortBy);
}

function isSortDirection(value: string | null): value is SortDirection {
  return SORT_DIRECTION_VALUES.includes(value as SortDirection);
}

// Invalid or missing values fall back to the defaults, so the backend never answers 400.
// The URL is not rewritten.
export function parseAdminReportsQuery(
  params: URLSearchParams
): AdminReportsQuery {
  const page = params.get("page");
  const sortBy = params.get("sortBy");
  const sortDirection = params.get("sortDirection");
  return {
    page: page !== null && /^\d+$/.test(page) ? Number(page) : DEFAULT_QUERY.page,
    sortBy: isSortBy(sortBy) ? sortBy : DEFAULT_QUERY.sortBy,
    sortDirection: isSortDirection(sortDirection)
      ? sortDirection
      : DEFAULT_QUERY.sortDirection,
  };
}

// "page=0&sortBy=createdAt&sortDirection=desc"
export function adminReportsQueryString(query: AdminReportsQuery): string {
  return new URLSearchParams({
    page: String(query.page),
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
  }).toString();
}
