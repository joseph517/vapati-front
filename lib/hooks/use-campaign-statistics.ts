import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type {
  CampaignStatisticsDTO,
  CampaignStatisticsResponse,
} from "@/lib/types";

export type CampaignStatisticsStatus = "loading" | "ready" | "error";

export function useCampaignStatistics(campaignId: string) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [statistics, setStatistics] = useState<CampaignStatisticsDTO | null>(
    null
  );
  const [status, setStatus] = useState<CampaignStatisticsStatus>("loading");
  const [reloadToken, setReloadToken] = useState(0);

  // Start over when navigating to another campaign
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [loadedForCampaign, setLoadedForCampaign] = useState(campaignId);
  if (loadedForCampaign !== campaignId) {
    setLoadedForCampaign(campaignId);
    setStatistics(null);
    setStatus("loading");
  }

  // Doesn't go back to "loading": the old figures stay until the new ones arrive.
  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    apiFetch<CampaignStatisticsResponse>(
      `/api/donations/campaign/${campaignId}/statistics`,
      { accessToken }
    )
      .then((data) => {
        if (cancelled) return;
        setStatistics(data.statistics);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [campaignId, accessToken, reloadToken]);

  return { statistics, status, reload };
}
