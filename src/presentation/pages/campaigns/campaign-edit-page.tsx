"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/data/auth/session-store";
import { campaignsService } from "@/data/campaigns/campaigns.service";
import type {
  CreateCampaignRequest,
  UpdateCampaignRequest,
} from "@/domain/campaigns/campaign.types";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import {
  CampaignForm,
} from "@/presentation/components/organisms/campaigns/campaign-form";
import {
  CampaignFormSkeleton,
} from "@/presentation/components/organisms/campaigns/campaign-form-skeleton";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";
import { cn } from "@/presentation/utils/cn";

export function CampaignEditPage() {
  const router = useRouter();
  const params = useParams<{ campaignId: string }>();
  const userInfo = useAuthStore((state) => state.userInfo);

  const { data: campaign, error: loadError } = useApiQuery(
    campaignsService.keys.detail(params.campaignId),
    () => campaignsService.getById(params.campaignId)
  );
  const [saving, setSaving] = useState(false);

  const campaignHref = `/campaigns/${params.campaignId}`;

  // Keeps `saving` on after a successful PUT until the navigation happens.
  async function updateCampaign(payload: CreateCampaignRequest) {
    setSaving(true);
    try {
      const body: UpdateCampaignRequest = payload;
      await campaignsService.update(params.campaignId, body);
      router.replace(`${campaignHref}?history=open`);
    } catch (error) {
      setSaving(false);
      throw error;
    }
  }

  if (loadError) {
    return (
      <main className="mx-auto flex max-w-[620px] flex-col px-6 pt-11 pb-20">
        <ErrorCard
          title={
            loadError.status === 404
              ? "No encontramos esta campaña"
              : "No pudimos cargar la campaña"
          }
          message={loadError.message}
          actionLabel="Volver a la campaña"
          actionHref={campaignHref}
        />
      </main>
    );
  }

  if (!campaign) {
    return (
      <main className="mx-auto flex max-w-[620px] flex-col px-6 pt-11 pb-20">
        <CampaignFormSkeleton />
      </main>
    );
  }

  if (userInfo?.userId !== campaign.userId) {
    return (
      <main className="mx-auto flex max-w-[620px] flex-col px-6 pt-11 pb-20">
        <ErrorCard
          title="No podés editar esta campaña"
          message="Solo quien la creó puede cambiar sus datos."
          actionLabel="Volver a la campaña"
          actionHref={campaignHref}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto flex max-w-[620px] flex-col px-6 pt-11 pb-20">
      <Link
        href={campaignHref}
        aria-disabled={saving || undefined}
        tabIndex={saving ? -1 : undefined}
        className={cn(
          "mb-4 text-[13.5px] text-muted-foreground hover:text-foreground",
          saving && "pointer-events-none opacity-50"
        )}
      >
        ← Volver a la campaña
      </Link>
      <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
        Editar campaña
      </h1>
      <p className="mt-2 mb-7 text-sm text-muted-foreground">{campaign.name}</p>

      <CampaignForm
        initialValues={{
          name: campaign.name,
          description: campaign.description,
          amountGoal: String(campaign.amountGoal),
          categoryIds: campaign.categories.map((category) => category.id),
        }}
        currentCampaign={campaign}
        submitLabel="Guardar cambios"
        pendingLabel="guardando…"
        cancelHref={campaignHref}
        onSubmit={updateCampaign}
      />
    </main>
  );
}
