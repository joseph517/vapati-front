import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import {
  ADMIN_USERS_PAGE_SIZE,
  type AdminUsersQuery,
} from "@/domain/admin/admin-users-query";
import type { SpringPage } from "@/domain/shared/shared.types";
import type { UserDTO } from "@/domain/users/user.types";

const keys = {
  paginated: (query: AdminUsersQuery) => {
    const params = new URLSearchParams({
      page: String(query.page),
      size: String(ADMIN_USERS_PAGE_SIZE),
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    });
    return `/api/users/list/paginated?${params.toString()}`;
  },
};

// ADMIN only: the backend answers 403 to anyone else
export const adminUsersService = {
  keys,
  listPaginated: (query: AdminUsersQuery) =>
    apiFetch<SpringPage<UserDTO>>(keys.paginated(query), auth()),
};
