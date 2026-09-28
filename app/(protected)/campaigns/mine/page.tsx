"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaign-card";
import { CampaignGridSkeleton } from "@/components/campaign-grid-skeleton";
import { EmptyState } from "@/components/empty-state";
import { ErrorCard } from "@/components/error-card";
import { NoticeAlert } from "@/components/notice-alert";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO, MyCampaignsResponse } from "@/lib/types";

const FLASH_MESSAGES: Record<string, string> = {
  "campaign-deleted": "La campaña se borró.",
};

export default function MyCampaignsPage() {
  return (
    <Suspense fallback={null}>
      <MyCampaigns />
    </Suspense>
  );
}

function MyCampaigns() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((state) => state.accessToken);

  const flash = FLASH_MESSAGES[searchParams.get("flash") ?? ""];
  const [items, setItems] = useState<CampaignResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  // Runs on mount and on "Reintentar" only: dismissing the flash doesn't refetch.
  useEffect(() => {
    let cancelled = false;

    apiFetch<MyCampaignsResponse>("/api/campaigns/my-campaigns", {
      accessToken,
    })
      .then((data) => {
        if (!cancelled) {
          setItems([...data.campaigns].sort((a, b) => b.id - a.id));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Ocurrió un error inesperado. Intentá de nuevo."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken]);

  function reload() {
    setLoading(true);
    setError(null);
    setReloadToken((token) => token + 1);
  }

  let countLine: string;
  if (loading) {
    countLine = "Cargando…";
  } else if (error) {
    countLine = "No se pudo cargar";
  } else {
    countLine =
      items.length === 1 ? "1 campaña" : `${items.length} campañas`;
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6 pt-11 pb-20">
      {flash && (
        <NoticeAlert
          className="mb-6"
          role="status"
          onDismiss={() => router.replace("/campaigns/mine", { scroll: false })}
        >
          {flash}
        </NoticeAlert>
      )}

      <div className="mb-[30px] flex flex-wrap items-end gap-5">
        <div>
          <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
            Mis campañas
          </h1>
          <p
            className={
              error && !loading
                ? "mt-1 text-sm text-destructive"
                : "mt-1 text-sm text-muted-foreground"
            }
          >
            {countLine}
          </p>
        </div>
        <Button
          asChild
          className="ml-auto px-[18px] py-[11px] text-sm font-semibold"
        >
          <Link href="/campaigns/new">Crear campaña</Link>
        </Button>
      </div>

      {loading && <CampaignGridSkeleton />}

      {!loading && error && (
        <ErrorCard
          title="No pudimos cargar tus campañas"
          message={error}
          actionLabel="Reintentar"
          onAction={reload}
        />
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Todavía no creaste campañas"
          action={
            <Button asChild className="mt-2">
              <Link href="/campaigns/new">Crear campaña</Link>
            </Button>
          }
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
          {items.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </main>
  );
}
