"use client";

import { useState, type FormEvent } from "react";
import { FormTextField } from "@/components/form-text-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import {
  CATEGORY_NAME_REQUIRED_MESSAGE,
  CATEGORY_TEXT_MAX_LENGTH,
  categoryNameError,
  toCreateCategoryRequest,
  type CategoryFormValues,
} from "@/domain/categories/category-form";
import type { CategoryDTO } from "@/domain/categories/category.types";
import { toErrorMessage } from "@/domain/shared/errors";
import { FIELD_LABEL_CLASSES } from "@/lib/form-classes";
import { cn } from "@/lib/utils";

const EMPTY_VALUES: CategoryFormValues = { name: "", description: "" };

// "Nueva categoría" card. Name errors stay under the field; the rest go to the
// section's error alert through `onError`.
export function AdminCategoryCreateForm({
  onMutationStart,
  onCreated,
  onError,
  className,
}: {
  onMutationStart: () => void;
  onCreated: (category: CategoryDTO) => void;
  onError: (message: string) => void;
  className?: string;
}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [values, setValues] = useState<CategoryFormValues>(EMPTY_VALUES);
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(name: string) {
    setValues((current) => ({ ...current, name }));
    setNameError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const request = toCreateCategoryRequest(values);
    if (!request.name) {
      setNameError(CATEGORY_NAME_REQUIRED_MESSAGE);
      return;
    }

    onMutationStart();
    setNameError(null);
    setSubmitting(true);
    try {
      const category = await apiFetch<CategoryDTO>("/api/categories/create", {
        method: "POST",
        accessToken,
        body: request,
      });
      setValues(EMPTY_VALUES);
      onCreated(category);
    } catch (err) {
      const message = categoryNameError(err);
      if (message) {
        setNameError(message);
      } else {
        onError(toErrorMessage(err));
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-5",
        className
      )}
    >
      <h3 className="font-serif text-lg leading-[1.2] font-medium text-foreground">
        Nueva categoría
      </h3>

      <FormTextField
        id="category-create-name"
        label="Nombre"
        value={values.name}
        onChange={handleNameChange}
        error={nameError ?? undefined}
        maxLength={CATEGORY_TEXT_MAX_LENGTH}
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category-create-description" className={FIELD_LABEL_CLASSES}>
          Descripción
        </Label>
        <Textarea
          id="category-create-description"
          value={values.description}
          placeholder="Opcional"
          rows={3}
          maxLength={CATEGORY_TEXT_MAX_LENGTH}
          onChange={(event) =>
            setValues((current) => ({ ...current, description: event.target.value }))
          }
          className="resize-y bg-secondary"
        />
      </div>

      <Button type="submit" disabled={submitting} className="font-semibold">
        Crear categoría
        {submitting && (
          <span className="animate-pulse text-[13px] font-normal opacity-85">
            creando…
          </span>
        )}
      </Button>

      <p className="text-[12.5px] text-[var(--ink-faint)]">
        Aparece en el registro, en Editar perfil y al crear campañas.
      </p>
    </form>
  );
}
