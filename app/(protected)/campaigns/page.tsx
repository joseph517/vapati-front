"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaign-card";
import { CampaignSearchBar } from "@/components/campaign-search-bar";
import { CategoryStrip } from "@/components/category-strip";
import { EmptyState } from "@/components/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useCategories } from "@/lib/hooks/use-categories";
import { useAuthStore } from "@/lib/store/auth-store";
import type { CampaignResponseDTO } from "@/lib/types";

export default function CampaignsPage() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [items, setItems] = useState<CampaignResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");

  useEffect(() => {
    loadCampaigns(filterCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategory]);

  function loadCampaigns(categoryId: number | null) {
    setLoading(true);
    setError(null);
    const query = categoryId ? `?categoryId=${categoryId}` : "";
    apiFetch<CampaignResponseDTO[]>(`/api/campaigns/list${query}`, {
      accessToken,
    })
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

  function toggleCategoryFilter(categoryId: number) {
    setFilterCategory((current) => (current === categoryId ? null : categoryId));
  }

  function clearFilters() {
    setFilterCategory(null);
    setSearch("");
    setSearchDraft("");
  }

  const searchTerm = search.trim().toLowerCase();
  const filteredItems = searchTerm
    ? items.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchTerm) ||
          campaign.description.toLowerCase().includes(searchTerm)
      )
    : items;

  const hasActiveFilter = filterCategory !== null || searchTerm !== "";
  const emptyNoFilter =
    !loading && !error && filteredItems.length === 0 && !hasActiveFilter;
  const emptyWithFilter =
    !loading && !error && filteredItems.length === 0 && hasActiveFilter;
  const ready = !loading && !error && filteredItems.length > 0;

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

      <div className="mb-[26px] border-t border-b border-[var(--divider)] py-[18px]">
        <CategoryStrip
          categories={categories}
          loading={categoriesLoading}
          error={categoriesError}
          activeId={filterCategory}
          onToggle={toggleCategoryFilter}
        />
        <CampaignSearchBar
          value={searchDraft}
          onChange={setSearchDraft}
          onSubmit={() => setSearch(searchDraft)}
        />
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
            onClick={() => loadCampaigns(filterCategory)}
            className="mt-4 rounded-md border border-[var(--accent-soft-border)] bg-white px-3 py-1.5 text-[13px] font-medium text-destructive"
          >
            Reintentar
          </button>
        </div>
      )}

      {emptyNoFilter && (
        <EmptyState
          title="Todavía no hay campañas"
          description="Creá la primera campaña para empezar a recibir aportes."
          action={
            <Button asChild className="mt-2">
              <Link href="/campaigns/new">Crear la primera</Link>
            </Button>
          }
        />
      )}

      {emptyWithFilter && (
        <EmptyState
          title="Ninguna campaña coincide con este filtro"
          description="Probá con otra categoría u otro estado, o volvé a ver todas las campañas."
          action={
            <Button variant="outline" className="mt-2" onClick={clearFilters}>
              Quitar filtros
            </Button>
          }
        />
      )}

      {ready && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-[18px]">
          {filteredItems.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </main>
  );
}
