import { useCallback } from "react";
import { useApiQuery } from "@/lib/hooks/use-api-query";
import type {
  CampaignStatisticsDTO,
  CampaignStatisticsResponse,
} from "@/lib/types";

export type CampaignStatisticsStatus = "loading" | "ready" | "error";

export function useCampaignStatistics(campaignId: string) {
  const { data, error, reload: reloadQuery } = useApiQuery<
    CampaignStatisticsResponse,
    CampaignStatisticsDTO
  >(`/api/donations/campaign/${campaignId}/statistics`, {
    select: (response) => response.statistics,
  });

  // Background: the old figures stay until the new ones arrive.
  const reload = useCallback(
    () => reloadQuery({ background: true }),
    [reloadQuery]
  );

  const status: CampaignStatisticsStatus = error
    ? "error"
    : data
      ? "ready"
      : "loading";

  return { statistics: data, status, reload };
}
