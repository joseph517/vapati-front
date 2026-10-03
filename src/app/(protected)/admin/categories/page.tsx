"use client";

import { useState } from "react";
import { categoriesService } from "@/data/categories/categories.service";
import {
  categoryCountLabel,
  sortCategoriesByName,
} from "@/domain/categories/category-form";
import type { CategoryDTO } from "@/domain/categories/category.types";
import { NoticeAlert } from "@/presentation/components/atoms/notice-alert";
import { EmptyState } from "@/presentation/components/molecules/empty-state";
import { ErrorCard } from "@/presentation/components/molecules/error-card";
import {
  AdminCategoriesSkeleton,
} from "@/presentation/components/organisms/admin/admin-categories-skeleton";
import {
  AdminCategoryCreateForm,
} from "@/presentation/components/organisms/admin/admin-category-create-form";
import {
  AdminCategoryEditForm,
} from "@/presentation/components/organisms/admin/admin-category-edit-form";
import {
  AdminCategoryList,
} from "@/presentation/components/organisms/admin/admin-category-list";
import {
  DeleteCategoryDialog,
} from "@/presentation/components/organisms/admin/delete-category-dialog";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

// The list is public: a non-admin who spoofs the role sees it, but the mutations answer 403.
export default function AdminCategoriesPage() {
  const { data: categories, loading, error, reload } = useApiQuery(
    categoriesService.keys.list(),
    categoriesService.list,
    { select: sortCategoriesByName }
  );
  // Section alerts: at most one of each. Starting a new mutation clears the error.
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // At most one row in edit mode. Opening another one discards it without asking.
  const [editingId, setEditingId] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  // The target outlives `deleteOpen` so the title doesn't go blank while the dialog closes.
  const [deleteTarget, setDeleteTarget] = useState<CategoryDTO | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function clearErrorNotice() {
    setErrorNotice(null);
  }

  function handleCreated(category: CategoryDTO) {
    setSuccessNotice(`Creaste la categoría «${category.name}».`);
    reload({ background: true });
  }

  function closeEdit() {
    setEditingId(null);
  }

  // Editing shows no success notice: the updated row is the confirmation.
  function handleEditSaved() {
    closeEdit();
    reload({ background: true });
  }

  // Another admin deleted it: drop the ghost row.
  function handleEditNotFound(message: string) {
    closeEdit();
    setErrorNotice(message);
    reload({ background: true });
  }

  function openDelete(category: CategoryDTO) {
    setDeleteTarget(category);
    setDeleteOpen(true);
  }

  function handleDeleted(category: CategoryDTO) {
    setDeleteOpen(false);
    if (editingId === category.id) closeEdit();
    setSuccessNotice(`Borraste la categoría «${category.name}».`);
    reload({ background: true });
  }

  function handleDeleteNotFound(message: string) {
    setDeleteOpen(false);
    setErrorNotice(message);
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
          onMutationStart={clearErrorNotice}
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
            <AdminCategoryList
              categories={categories}
              editingId={editingId}
              editDisabled={savingEdit}
              onEdit={(category) => setEditingId(category.id)}
              onDelete={openDelete}
              renderEditForm={(category) => (
                <AdminCategoryEditForm
                  key={category.id}
                  category={category}
                  onCancel={closeEdit}
                  onSavingChange={setSavingEdit}
                  onMutationStart={clearErrorNotice}
                  onSaved={handleEditSaved}
                  onNotFound={handleEditNotFound}
                  onError={setErrorNotice}
                />
              )}
            />
          )}
        </div>
      </div>

      {deleteTarget && (
        <DeleteCategoryDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          category={deleteTarget}
          onMutationStart={clearErrorNotice}
          onDeleted={handleDeleted}
          onNotFound={handleDeleteNotFound}
        />
      )}
    </>
  );
}
