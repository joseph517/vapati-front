import { Suspense } from "react";
import { AdminUserDetailPage } from "@/presentation/pages/admin/admin-user-detail-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminUserDetailPage />
    </Suspense>
  );
}
