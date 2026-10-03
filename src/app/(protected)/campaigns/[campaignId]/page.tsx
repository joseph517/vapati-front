import { Suspense } from "react";
import { CampaignDetailPage } from "@/presentation/pages/campaigns/campaign-detail-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CampaignDetailPage />
    </Suspense>
  );
}
