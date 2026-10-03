"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CampaignForm } from "@/components/campaign-form";
import type {
  CreateCampaignRequest,
  CreateCampaignResponse,
} from "@/domain/campaigns/campaign.types";
import { apiFetch } from "@/lib/api";
import type { CampaignFormValues } from "@/lib/campaign-form";
import { useAuthStore } from "@/lib/store/auth-store";

const EMPTY_VALUES: CampaignFormValues = {
  name: "",
  description: "",
  amountGoal: "",
  categoryIds: [],
};

export default function NewCampaignPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);

  async function createCampaign(payload: CreateCampaignRequest) {
    const data = await apiFetch<CreateCampaignResponse>(
      "/api/campaigns/create",
      { method: "POST", accessToken, body: payload }
    );
    router.push(`/campaigns/${data.campaignId}`);
  }

  return (
    <main className="mx-auto flex max-w-[620px] flex-col px-6 pt-11 pb-20">
      <Link
        href="/campaigns"
        className="mb-4 text-[13.5px] text-muted-foreground hover:text-foreground"
      >
        ← Volver a campañas
      </Link>
      <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
        Nueva campaña
      </h1>
      <p className="mt-2 mb-7 text-sm text-muted-foreground">
        Contá qué necesitás y cuánto. Vas a poder compartir el enlace en
        cuanto se cree.
      </p>

      <CampaignForm
        initialValues={EMPTY_VALUES}
        submitLabel="Publicar campaña"
        pendingLabel="enviando…"
        onSubmit={createCampaign}
      />
    </main>
  );
}
