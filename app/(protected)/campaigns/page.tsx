"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/progress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO } from "@/lib/types";
import { formatCurrencyCOP } from "@/lib/utils";

function truncateDescription(text: string): string {
  return text.length > 130 ? `${text.slice(0, 130)}…` : text;
}

export default function CampaignsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [items, setItems] = useState<CampaignResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function loadCampaigns() {
    setLoading(true);
    setError(null);
    apiFetch<CampaignResponseDTO[]>("/api/campaigns/list", { accessToken })
      .then((data) => setItems(data))
      .catch((err) => {
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Ocurrió un error inesperado. Intentá de nuevo."
        );
      })
      .finally(() => setLoading(false));
  }

  const empty = !loading && !error && items.length === 0;
  const ready = !loading && !error && items.length > 0;

  let countLine: string;
  if (loading) {
    countLine = "Cargando…";
  } else if (error) {
    countLine = "No se pudo cargar";
  } else {
    countLine =
      items.length === 1 ? "1 campaña activa" : `${items.length} campañas activas`;
  }

  return (
    <main className="mx-auto max-w-[1080px] px-6 pt-11 pb-20">
      <div className="mb-[30px] flex flex-wrap items-end gap-5">
        <div>
          <h1 className="font-serif text-[32px] leading-[1.1] font-medium tracking-[-0.015em] text-foreground">
            Campañas abiertas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{countLine}</p>
        </div>
        <Button
          asChild
          className="ml-auto px-[18px] py-[11px] text-sm font-semibold"
        >
          <Link href="/campaigns/new">Crear campaña</Link>
        </Button>
      </div>

      {loading && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-[22px]"
            >
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-2/3" />
              <Skeleton className="mt-4 h-[7px] w-full rounded-full" />
              <Skeleton className="h-3.5 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-[var(--danger-border)] bg-[var(--danger-bg)] p-6">
          <h2 className="font-serif text-base text-destructive">
            No pudimos cargar las campañas
          </h2>
          <p className="mt-1.5 text-[13.5px] text-destructive/90">{error}</p>
          <button
            type="button"
            onClick={loadCampaigns}
            className="mt-4 rounded-md border border-[var(--accent-soft-border)] bg-white px-3 py-1.5 text-[13px] font-medium text-destructive"
          >
            Reintentar
          </button>
        </div>
      )}

      {empty && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[var(--border-dashed)] px-6 py-[60px] text-center">
          <h2 className="font-serif text-lg text-foreground">
            Todavía no hay campañas
          </h2>
          <p className="max-w-[380px] text-sm text-muted-foreground">
            Creá la primera campaña para empezar a recibir aportes.
          </p>
          <Button asChild className="mt-2">
            <Link href="/campaigns/new">Crear la primera</Link>
          </Button>
        </div>
      )}

      {ready && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
          {items.map((campaign) => {
            const pct = Math.min(
              100,
              Math.round((campaign.amountRaised / campaign.amountGoal) * 100)
            );
            return (
              <Link
                key={campaign.id}
                href={`/campaigns/${campaign.id}`}
                className="group flex flex-col rounded-xl border border-border bg-card p-[22px] text-left transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
              >
                <span className="text-xs font-medium tracking-[.08em] text-[var(--ink-eyebrow)] uppercase">
                  Campaña #{campaign.id}
                </span>
                <h3 className="mt-1 font-serif text-xl leading-[1.25] tracking-[-0.01em] text-foreground">
                  {campaign.name}
                </h3>
                <p className="mt-2 text-[13.5px] leading-[1.55] text-muted-foreground">
                  {truncateDescription(campaign.description)}
                </p>
                <div className="mt-4 flex-1" />
                <ProgressBar value={pct} className="h-[7px]" />
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">
                    {formatCurrencyCOP(campaign.amountRaised)}
                  </span>
                  <span className="text-[12.5px] text-[var(--ink-label)]">
                    {pct}% de {formatCurrencyCOP(campaign.amountGoal)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
