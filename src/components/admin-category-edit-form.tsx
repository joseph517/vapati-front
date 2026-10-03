"use client";

import { useState, type FormEvent } from "react";
import { ADMIN_CATEGORY_ROW_CLASS } from "@/components/admin-category-row";
import { FormTextField } from "@/components/form-text-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryDTO } from "@/domain/categories/category.types";
import { toErrorMessage } from "@/domain/shared/errors";
import {
  CATEGORY_NAME_REQUIRED_MESSAGE,
  CATEGORY_TEXT_MAX_LENGTH,
  categoryNameError,
  isCategoryNotFoundError,
  isCategoryUnchanged,
  toUpdateCategoryRequest,
  type CategoryFormValues,
} from "@/lib/admin-categories";
import { apiFetch } from "@/lib/api";
import { FIELD_LABEL_CLASSES } from "@/lib/form-classes";
import { useAuthStore } from "@/lib/store/auth-store";

// Edit mode of a row. Name errors stay under the field and the row stays open.
// A 404 goes to `onNotFound` (the caller closes it); any other error to `onError`.
export function AdminCategoryEditForm({
  category,
  onCancel,
  onSavingChange,
  onMutationStart,
  onSaved,
  onNotFound,
  onError,
}: {
  category: CategoryDTO;
  onCancel: () => void;
  onSavingChange: (saving: boolean) => void;
  onMutationStart: () => void;
  onSaved: () => void;
  onNotFound: (message: string) => void;
  onError: (message: string) => void;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [values, setValues] = useState<CategoryFormValues>({
    name: category.name,
    description: category.description ?? "",
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function handleNameChange(name: string) {
    setValues((current) => ({ ...current, name }));
    setNameError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const request = toUpdateCategoryRequest(values);
    if (!request.name) {
      setNameError(CATEGORY_NAME_REQUIRED_MESSAGE);
      return;
    }
    if (isCategoryUnchanged(values, category)) {
      onCancel();
      return;
    }

    onMutationStart();
    setNameError(null);
    setSaving(true);
    onSavingChange(true);
    try {
      await apiFetch<CategoryDTO>(`/api/categories/update/${category.id}`, {
        method: "PUT",
        accessToken,
        body: request,
      });
      onSaved();
    } catch (err) {
      const message = categoryNameError(err);
      if (message) {
        setNameError(message);
      } else if (isCategoryNotFoundError(err)) {
        onNotFound(toErrorMessage(err));
      } else {
        onError(toErrorMessage(err));
      }
    } finally {
      setSaving(false);
      onSavingChange(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={`Editar ${category.name}`}
      className={`${ADMIN_CATEGORY_ROW_CLASS} flex flex-col gap-4 bg-[var(--track-soft)]`}
    >
      <FormTextField
        id={`category-edit-name-${category.id}`}
        label="Nombre"
        value={values.name}
        onChange={handleNameChange}
        error={nameError ?? undefined}
        maxLength={CATEGORY_TEXT_MAX_LENGTH}
      />

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor={`category-edit-description-${category.id}`}
          className={FIELD_LABEL_CLASSES}
        >
          Descripción
        </Label>
        <Textarea
          id={`category-edit-description-${category.id}`}
          value={values.description}
          placeholder="Opcional"
          rows={2}
          maxLength={CATEGORY_TEXT_MAX_LENGTH}
          onChange={(event) =>
            setValues((current) => ({ ...current, description: event.target.value }))
          }
          className="resize-y bg-secondary"
        />
      </div>

      <div className="flex flex-wrap justify-end gap-2.5">
        <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving} className="font-semibold">
          Guardar cambios
          {saving && (
            <span className="animate-pulse text-[13px] font-normal opacity-85">
              guardando…
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
