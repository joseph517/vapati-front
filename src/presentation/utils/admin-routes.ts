import {
  adminReportsQueryString,
  parseAdminReportsQuery,
  type AdminReportsQuery,
} from "@/domain/admin/admin-reports-query";
import {
  adminUsersQueryString,
  parseAdminUsersQuery,
  type AdminUsersQuery,
} from "@/domain/admin/admin-users-query";

export function adminUsersHref(query: AdminUsersQuery): string {
  return `/admin/users?${adminUsersQueryString(query)}`;
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

export function adminReportsHref(query: AdminReportsQuery): string {
  return `/admin/reports?${adminReportsQueryString(query)}`;
}

// "from" keeps the inbox's page and sort for the detail's back link
export function adminReportDetailHref(
  reportId: number,
  query: AdminReportsQuery
): string {
  const params = new URLSearchParams({ from: adminReportsQueryString(query) });
  return `/admin/reports/${reportId}?${params.toString()}`;
}

// Same as adminUsersBackHref: "from" is re-parsed and the path is always /admin/reports.
export function adminReportsBackHref(from: string | null): string {
  if (from === null) return "/admin/reports";
  return adminReportsHref(parseAdminReportsQuery(new URLSearchParams(from)));
}
