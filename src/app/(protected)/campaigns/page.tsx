"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CampaignCard } from "@/components/campaign-card";
import { CampaignGridSkeleton } from "@/components/campaign-grid-skeleton";
import { CampaignSearchBar } from "@/components/campaign-search-bar";
import { CategoryStrip } from "@/components/category-strip";
import { EmptyState } from "@/components/empty-state";
import { ErrorCard } from "@/components/error-card";
import { campaignsService } from "@/data/campaigns/campaigns.service";
import { useCategories } from "@/presentation/hooks/categories/use-categories";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

export default function CampaignsPage() {
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [searchDraft, setSearchDraft] = useState("");

  // A new filter is a new key: the list starts over with the skeleton.
  const { data, loading, error, reload } = useApiQuery(
    campaignsService.keys.list(filterCategory),
    () => campaignsService.list(filterCategory)
  );
  const items = data ?? [];

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

      {loading && <CampaignGridSkeleton />}

      {!loading && error && (
        <ErrorCard
          title="No pudimos cargar las campañas"
          message={error.message}
          actionLabel="Reintentar"
          onAction={() => reload()}
        />
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
