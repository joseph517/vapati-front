import { Suspense } from "react";
import { AdminReportsPage } from "@/presentation/pages/admin/admin-reports-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminReportsPage />
    </Suspense>
  );
}
