import type { AdminUserSortBy } from "@/domain/admin/admin.types";
import type { SortDirection } from "@/domain/shared/shared.types";

export const ADMIN_USERS_PAGE_SIZE = 10;

export type AdminUsersQuery = {
  page: number; // >= 0
  sortBy: AdminUserSortBy;
  sortDirection: SortDirection;
};

const DEFAULT_QUERY: AdminUsersQuery = {
  page: 0,
  sortBy: "id",
  sortDirection: "asc",
};

const SORT_BY_VALUES: readonly AdminUserSortBy[] = ["id", "createdAt"];
const SORT_DIRECTION_VALUES: readonly SortDirection[] = ["asc", "desc"];

function isSortBy(value: string | null): value is AdminUserSortBy {
  return SORT_BY_VALUES.includes(value as AdminUserSortBy);
}

function isSortDirection(value: string | null): value is SortDirection {
  return SORT_DIRECTION_VALUES.includes(value as SortDirection);
}

// Invalid or missing values fall back to the defaults, so the backend never answers 400.
// The URL is not rewritten.
export function parseAdminUsersQuery(params: URLSearchParams): AdminUsersQuery {
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

// "page=0&sortBy=id&sortDirection=asc"
export function adminUsersQueryString(query: AdminUsersQuery): string {
  return new URLSearchParams({
    page: String(query.page),
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
  }).toString();
}

export function adminUsersHref(query: AdminUsersQuery): string {
  return `/admin/users?${adminUsersQueryString(query)}`;
}

export function adminUsersApiPath(query: AdminUsersQuery): string {
  const params = new URLSearchParams({
    page: String(query.page),
    size: String(ADMIN_USERS_PAGE_SIZE),
    sortBy: query.sortBy,
    sortDirection: query.sortDirection,
  });
  return `/api/users/list/paginated?${params.toString()}`;
}

// "from" keeps the list's page and sort for the detail's back link
export function adminUserDetailHref(userId: number, query: AdminUsersQuery): string {
  const params = new URLSearchParams({ from: adminUsersQueryString(query) });
  return `/admin/users/${userId}?${params.toString()}`;
}

// "from" arrives already decoded by URLSearchParams. It is re-parsed and the path is always
// /admin/users, so it cannot redirect anywhere else.
export function adminUsersBackHref(from: string | null): string {
  if (from === null) return "/admin/users";
  return adminUsersHref(parseAdminUsersQuery(new URLSearchParams(from)));
}
