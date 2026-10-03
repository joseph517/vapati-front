"use client";

import { useState } from "react";
import type { CampaignResponseDTO } from "@/domain/campaigns/campaign.types";
import type { PublicationResponseDTO } from "@/domain/publications/publication.types";
import {
  canPublish,
  publicationsEmptyText,
} from "@/domain/publications/publications";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import {
  InlineRetryAlert,
} from "@/presentation/components/molecules/inline-retry-alert";
import {
  PublicationRow,
} from "@/presentation/components/molecules/publications/publication-row";
import {
  PublicationRowsSkeleton,
} from "@/presentation/components/molecules/publications/publication-rows-skeleton";
import {
  DeletePublicationDialog,
} from "@/presentation/components/organisms/publications/delete-publication-dialog";
import {
  PublicationComposer,
} from "@/presentation/components/organisms/publications/publication-composer";
import { useSession } from "@/presentation/hooks/auth/use-session";
import { useCampaignPublications } from "@/presentation/hooks/publications/use-campaign-publications";
import { cn } from "@/presentation/utils/cn";

// "Novedades" section of the campaign detail, visible to anyone and always open.
export function CampaignPublicationsPanel({
  campaign,
  onCampaignStale,
}: {
  campaign: CampaignResponseDTO;
  onCampaignStale: () => void;
}) {
  const userInfo = useSession((state) => state.userInfo);
  const isOwner = userInfo?.userId === campaign.userId;
  const isClosed = campaign.status === "CLOSED";
  const showComposer = canPublish(campaign, userInfo?.userId);
  const showClosedNote = isOwner && isClosed;

  const {
    data: publications,
    loading,
    error,
    reload,
  } = useCampaignPublications(campaign.id);

  const loaded = !loading && !error && publications !== null;

  // Kept apart from `deleteOpen` so the dialog keeps its content while closing.
  const [deleteTarget, setDeleteTarget] =
    useState<PublicationResponseDTO | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function openDelete(publication: PublicationResponseDTO) {
    setDeleteTarget(publication);
    setDeleteOpen(true);
  }

  function handleDeleted() {
    setDeleteOpen(false);
    reload({ background: true });
  }

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

      {showComposer && (
        <PublicationComposer
          campaignId={campaign.id}
          onPublished={() => reload({ background: true })}
          onCampaignStale={onCampaignStale}
        />
      )}

      {showClosedNote && (
        <NoticeAlert role="status" className="mt-4">
          No podés publicar mientras la campaña está cerrada. Las novedades
          que ya publicaste se pueden borrar.
        </NoticeAlert>
      )}

      <div
        className={cn(showComposer || showClosedNote ? "mt-[22px]" : "mt-4")}
      >
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
              <PublicationRow
                key={publication.id}
                publication={publication}
                onDelete={isOwner ? () => openDelete(publication) : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <DeletePublicationDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          publication={deleteTarget}
          onDeleted={handleDeleted}
        />
      )}
    </section>
  );
}
