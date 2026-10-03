import { ADMIN_USERS_GRID, AdminUserRow } from "@/components/admin-user-row";
import { AdminUsersSkeleton } from "@/components/admin-users-skeleton";
import type { AdminUsersQuery } from "@/domain/admin/admin-users-query";
import type { UserDTO } from "@/domain/users/user.types";

const COLUMNS = ["ID", "Nombre", "Usuario", "Email", "Teléfono", "Intereses"];

// Column headers only on wide screens: the narrow cards carry their own layout.
export function AdminUsersTable({
  users,
  query,
  loading,
}: {
  users: UserDTO[];
  query: AdminUsersQuery;
  loading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div
        className={`hidden border-b border-border bg-[var(--track-soft)] px-5 py-2.5 min-[820px]:grid ${ADMIN_USERS_GRID}`}
      >
        {COLUMNS.map((column) => (
          <span
            key={column}
            className="text-[11.5px] font-semibold tracking-[0.06em] text-[var(--ink-eyebrow)] uppercase"
          >
            {column}
          </span>
        ))}
      </div>
      {loading ? (
        <AdminUsersSkeleton />
      ) : (
        users.map((user) => (
          <AdminUserRow key={user.id} user={user} query={query} />
        ))
      )}
    </div>
  );
}
