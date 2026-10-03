import { Suspense } from "react";
import { MyCampaignsPage } from "@/presentation/pages/campaigns/my-campaigns-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MyCampaignsPage />
    </Suspense>
  );
}
