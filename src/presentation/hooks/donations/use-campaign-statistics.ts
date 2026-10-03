import { useCallback } from "react";
import { donationsService } from "@/data/donations/donations.service";
import type { LoadStatus } from "@/domain/shared/shared.types";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

export function useCampaignStatistics(campaignId: string) {
  const { data, error, reload: reloadQuery } = useApiQuery(
    donationsService.keys.statistics(campaignId),
    () => donationsService.statistics(campaignId),
    { select: (response) => response.statistics }
  );

  // Background: the old figures stay until the new ones arrive.
  const reload = useCallback(
    () => reloadQuery({ background: true }),
    [reloadQuery]
  );

  const status: LoadStatus = error
    ? "error"
    : data
      ? "ready"
      : "loading";

  return { statistics: data, status, reload };
}
