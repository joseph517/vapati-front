import { Suspense } from "react";
import { AdminReportDetailPage } from "@/presentation/pages/admin/admin-report-detail-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <AdminReportDetailPage />
    </Suspense>
  );
}
