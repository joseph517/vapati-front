"use client";

import { InlineRetryAlert } from "@/components/inline-retry-alert";
import { PublicationRow } from "@/components/publication-row";
import { PublicationRowsSkeleton } from "@/components/publication-rows-skeleton";
import { useApiQuery } from "@/lib/hooks/use-api-query";
import { publicationsEmptyText } from "@/lib/publications";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO, PublicationResponseDTO } from "@/lib/types";

// "Novedades" section of the campaign detail, visible to anyone and always open.
export function CampaignPublicationsPanel({
  campaign,
}: {
  campaign: CampaignResponseDTO;
}) {
  const userInfo = useAuthStore((state) => state.userInfo);
  const isOwner = userInfo?.userId === campaign.userId;
  const isClosed = campaign.status === "CLOSED";

  const {
    data: publications,
    loading,
    error,
    reload,
  } = useApiQuery<PublicationResponseDTO[]>(
    `/api/campaigns/${campaign.id}/publications`
  );

  const loaded = !loading && !error && publications !== null;

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-[26px]">
      <div className="flex items-baseline gap-2">
        <h2 className="font-serif text-lg font-medium text-foreground">
          Novedades
        </h2>
        {loaded && publications.length > 0 && (
          <span className="text-[13px] text-[var(--ink-faint)]">
            {publications.length}
          </span>
        )}
      </div>

      <div className="mt-4">
        {loading && <PublicationRowsSkeleton />}

        {!loading && error && (
          <InlineRetryAlert message={error.message} onRetry={() => reload()} />
        )}

        {loaded && publications.length === 0 && (
          <div className="rounded-[9px] border-[1.5px] border-dashed border-[var(--border-dashed)] p-5 text-center text-[13.5px] text-pretty text-muted-foreground">
            {publicationsEmptyText(isOwner, isClosed)}
          </div>
        )}

        {loaded && publications.length > 0 && (
          <div className="flex flex-col">
            {publications.map((publication) => (
              <PublicationRow key={publication.id} publication={publication} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
