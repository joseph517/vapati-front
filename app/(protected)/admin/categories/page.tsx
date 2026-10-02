"use client";

import { useState } from "react";
import { AdminCategoriesSkeleton } from "@/components/admin-categories-skeleton";
import { AdminCategoryCreateForm } from "@/components/admin-category-create-form";
import { AdminCategoryList } from "@/components/admin-category-list";
import { EmptyState } from "@/components/empty-state";
import { ErrorCard } from "@/components/error-card";
import { NoticeAlert } from "@/components/notice-alert";
import { categoryCountLabel, sortCategoriesByName } from "@/lib/admin-categories";
import { useApiQuery } from "@/lib/hooks/use-api-query";
import type { CategoryDTO } from "@/lib/types";

// The list is public: a non-admin who spoofs the role sees it, but the mutations answer 403.
export default function AdminCategoriesPage() {
  const { data: categories, loading, error, reload } = useApiQuery<CategoryDTO[]>(
    "/api/categories/list",
    { public: true, select: sortCategoriesByName }
  );
  // Section alerts: at most one of each. Starting a new mutation clears the error.
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  function handleCreated(category: CategoryDTO) {
    setSuccessNotice(`Creaste la categoría «${category.name}».`);
    reload({ background: true });
  }

  let countLine: string;
  if (loading) {
    countLine = "Cargando…";
  } else if (error || !categories) {
    countLine = "No se pudo cargar";
  } else {
    countLine = categoryCountLabel(categories.length);
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="font-serif text-2xl leading-[1.15] font-medium text-foreground">
          Categorías
        </h2>
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

      {(successNotice || errorNotice) && (
        <div className="mb-6 flex flex-col gap-3">
          {successNotice && (
            <NoticeAlert role="status" onDismiss={() => setSuccessNotice(null)}>
              {successNotice}
            </NoticeAlert>
          )}
          {errorNotice && (
            <NoticeAlert tone="danger" onDismiss={() => setErrorNotice(null)}>
              {errorNotice}
            </NoticeAlert>
          )}
        </div>
      )}

      {/* One column with the form on top; from 820px the form sits on the right. */}
      <div className="grid gap-6 min-[820px]:grid-cols-[minmax(0,1fr)_280px] min-[820px]:items-start">
        <AdminCategoryCreateForm
          onMutationStart={() => setErrorNotice(null)}
          onCreated={handleCreated}
          onError={setErrorNotice}
          className="min-[820px]:sticky min-[820px]:top-20 min-[820px]:col-start-2 min-[820px]:row-start-1"
        />
        <div className="min-w-0 min-[820px]:col-start-1 min-[820px]:row-start-1">
          {loading && <AdminCategoriesSkeleton />}

          {!loading && error && (
            <ErrorCard
              title="No pudimos cargar las categorías"
              message={error.message}
              actionLabel="Reintentar"
              onAction={() => reload()}
            />
          )}

          {!loading && !error && categories && categories.length === 0 && (
            <EmptyState title="Todavía no hay categorías." />
          )}

          {!loading && !error && categories && categories.length > 0 && (
            <AdminCategoryList categories={categories} />
          )}
        </div>
      </div>
    </>
  );
}
