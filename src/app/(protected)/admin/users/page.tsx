import { Suspense } from "react";
import { AdminUsersPage } from "@/presentation/pages/admin/admin-users-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminUsersPage />
    </Suspense>
  );
}
