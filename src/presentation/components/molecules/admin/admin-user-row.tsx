import Link from "next/link";
import { UserIdPill } from "@/components/user-id-pill";
import type { AdminUsersQuery } from "@/domain/admin/admin-users-query";
import type { UserDTO } from "@/domain/users/user.types";
import { adminUserDetailHref } from "@/presentation/utils/admin-routes";

// Shared by the header, the rows and the skeleton so the columns line up.
// ID, Nombre, Usuario, Email, Teléfono, Intereses
export const ADMIN_USERS_GRID =
  "grid-cols-[72px_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.5fr)] gap-4";

function InterestPills({ categories }: { categories: string[] }) {
  if (categories.length === 0) {
    return <span className="text-[13px] text-[var(--ink-faint)]">—</span>;
  }
  return (
    <div className="flex flex-wrap gap-1">
      {categories.map((name) => (
        <span
          key={name}
          className="rounded-full border border-input bg-white px-2 py-0.5 text-[11.5px] font-medium text-muted-foreground"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

// The whole row is a link: Enter, middle click and "open in new tab" work without extra code.
// Wide screens get the 6-column grid, narrow ones a card.
export function AdminUserRow({
  user,
  query,
}: {
  user: UserDTO;
  query: AdminUsersQuery;
}) {
  const { firstName, lastName, userName, email, phone } = user.userInfo;
  const fullName = `${firstName} ${lastName}`;

  return (
    <Link
      href={adminUserDetailHref(user.id, query)}
      className="block border-t border-[var(--divider)] px-5 py-4 transition-colors first:border-t-0 hover:bg-[var(--track-soft)] focus-visible:bg-[var(--track-soft)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
    >
      <div className={`hidden items-center min-[820px]:grid ${ADMIN_USERS_GRID}`}>
        <div>
          <UserIdPill id={user.id} bare />
        </div>
        <span className="truncate text-sm font-medium text-foreground">
          {fullName}
        </span>
        <span className="truncate text-[13px] text-muted-foreground">
          @{userName}
        </span>
        <span className="truncate text-[13px] text-[var(--ink-body)]">{email}</span>
        <span className="truncate text-[13px] text-[var(--ink-body)]">{phone}</span>
        <InterestPills categories={user.categories} />
      </div>

      <div className="flex flex-col gap-1.5 min-[820px]:hidden">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-medium break-words text-foreground">
              {fullName}
            </p>
            <p className="text-[13px] break-all text-muted-foreground">
              @{userName}
            </p>
          </div>
          <UserIdPill id={user.id} />
        </div>
        <p className="text-[13px] break-all text-[var(--ink-body)]">{email}</p>
        <p className="text-[13px] text-[var(--ink-body)]">{phone}</p>
        <div className="mt-1">
          <InterestPills categories={user.categories} />
        </div>
      </div>
    </Link>
  );
}
