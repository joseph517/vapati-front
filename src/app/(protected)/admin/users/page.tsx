"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AdminUsersSortControls } from "@/components/admin-users-sort-controls";
import { AdminUsersTable } from "@/components/admin-users-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorCard } from "@/components/error-card";
import { PaginationControls } from "@/components/pagination-controls";
import type { SpringPage } from "@/domain/shared/shared.types";
import type { UserDTO } from "@/domain/users/user.types";
import {
  adminUsersApiPath,
  adminUsersHref,
  parseAdminUsersQuery,
  type AdminUsersQuery,
} from "@/lib/admin-users";
import { useApiQuery } from "@/lib/hooks/use-api-query";

export default function AdminUsersPage() {
  return (
    <Suspense fallback={null}>
      <AdminUsers />
    </Suspense>
  );
}

function AdminUsers() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = parseAdminUsersQuery(searchParams);

  // A non-admin gets 403 here: the layout's guard is UI-only.
  const { data, loading, error, reload } = useApiQuery<SpringPage<UserDTO>>(
    adminUsersApiPath(query)
  );

  const goTo = (next: AdminUsersQuery) => router.push(adminUsersHref(next));

  let countLine: string;
  if (loading) {
    countLine = "Cargando…";
  } else if (error || !data) {
    countLine = "No se pudo cargar";
  } else {
    countLine =
      data.totalElements === 1 ? "1 usuario" : `${data.totalElements} usuarios`;
  }

  const users = data?.content ?? [];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl leading-[1.15] font-medium text-foreground">
            Usuarios
          </h2>
          <p
            className={
              error && !loading
                ? "mt-1 text-sm text-destructive"
                : "mt-1 text-sm text-muted-foreground"
            }
          >
            {countLine}
          </p>
        </div>
        <AdminUsersSortControls query={query} onChange={goTo} />
      </div>

      {loading && <AdminUsersTable users={[]} query={query} loading />}

      {!loading && error && (
        <ErrorCard
          title="No pudimos cargar los usuarios"
          message={error.message}
          actionLabel="Reintentar"
          onAction={() => reload()}
        />
      )}

      {!loading && !error && data && data.totalElements === 0 && (
        <EmptyState title="Todavía no hay usuarios." />
      )}

      {!loading &&
        !error &&
        data &&
        users.length === 0 &&
        data.totalElements > 0 && (
        <EmptyState
          title="Esta página no tiene usuarios."
          action={
            <Button asChild variant="outline" className="mt-2">
              <Link href={adminUsersHref({ ...query, page: 0 })}>
                Ir a la primera página
              </Link>
            </Button>
          }
        />
      )}

      {!loading && !error && users.length > 0 && (
        <>
          <AdminUsersTable users={users} query={query} loading={false} />
          <PaginationControls
            page={query.page}
            totalPages={Math.max(1, data?.totalPages ?? 1)}
            onChange={(page) => goTo({ ...query, page })}
          />
        </>
      )}
    </>
  );
}
