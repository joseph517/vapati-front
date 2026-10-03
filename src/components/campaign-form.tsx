"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CategorySelectChips } from "@/components/category-select-chips";
import { FieldError } from "@/components/field-error";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NoticeAlert } from "@/components/notice-alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type {
  CampaignResponseDTO,
  CreateCampaignRequest,
} from "@/domain/campaigns/campaign.types";
import {
  ApiClientError,
  UNEXPECTED_ERROR_MESSAGE,
} from "@/domain/shared/errors";
import {
  CAMPAIGN_FIELD_LABELS,
  MAX_CATEGORIES,
  MAX_TEXT_LENGTH,
  validateCampaignForm,
  type CampaignFieldKey,
  type CampaignFormValues,
} from "@/lib/campaign-form";
import { FIELD_LABEL_CLASSES, INVALID_FIELD_CLASSES } from "@/lib/form-classes";
import { useCategories } from "@/lib/hooks/use-categories";
import { cn, formatCurrencyCOP } from "@/lib/utils";

type FieldErrors = Partial<Record<CampaignFieldKey, string>>;

// Shared by create and edit. `currentCampaign` and `cancelHref` are edit-only.
export function CampaignForm({
  initialValues,
  currentCampaign,
  submitLabel,
  pendingLabel,
  cancelHref,
  onSubmit,
}: {
  initialValues: CampaignFormValues;
  currentCampaign?: CampaignResponseDTO;
  submitLabel: string;
  pendingLabel: string;
  cancelHref?: string;
  onSubmit: (payload: CreateCampaignRequest) => Promise<void>;
}) {
  const router = useRouter();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();

  const [values, setValues] = useState<CampaignFormValues>(initialValues);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverFieldKeys, setServerFieldKeys] = useState<string[]>([]);

  const goalValue = Number(values.amountGoal);
  // Edit-only: warns that changing the goal may move the campaign between statuses.
  const showGoalNotice =
    currentCampaign !== undefined &&
    currentCampaign.status !== "CLOSED" &&
    values.amountGoal !== "" &&
    goalValue !== currentCampaign.amountGoal;

  function updateField<K extends keyof CampaignFormValues>(
    key: K,
    value: CampaignFormValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function toggleCategory(categoryId: number) {
    updateField(
      "categoryIds",
      values.categoryIds.includes(categoryId)
        ? values.categoryIds.filter((id) => id !== categoryId)
        : [...values.categoryIds, categoryId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validation = validateCampaignForm(values);
    if (validation) {
      setFormError(validation.formError);
      setFieldErrors(validation.fieldErrors);
      setServerFieldKeys([]);
      return;
    }

    setFormError(null);
    setFieldErrors({});
    setServerFieldKeys([]);
    setSubmitting(true);
    try {
      await onSubmit({
        name: values.name,
        description: values.description,
        amountGoal: goalValue,
        categoryIds: values.categoryIds,
      });
      // On success the page navigates away, so the form stays in "submitting".
    } catch (error) {
      if (error instanceof ApiClientError) {
        setFormError(error.message);
        setFieldErrors(error.fields ?? {});
        setServerFieldKeys(Object.keys(error.fields ?? {}));
      } else {
        setFormError(UNEXPECTED_ERROR_MESSAGE);
      }
      setSubmitting(false);
    }
  }

  const summaryLabels = serverFieldKeys
    .map((key) => CAMPAIGN_FIELD_LABELS[key as CampaignFieldKey] ?? key)
    .join(", ");

  return (
    <>
      {(formError || serverFieldKeys.length > 0) && (
        <Alert
          variant="destructive"
          className="mb-5 border-[var(--danger-border)] bg-[var(--danger-bg)]"
        >
          <AlertDescription className="text-[13.5px]">
            {serverFieldKeys.length > 0 && (
              <p className="font-semibold">
                Revisá estos campos: {summaryLabels}
              </p>
            )}
            {formError && <p>{formError}</p>}
          </AlertDescription>
        </Alert>
      )}

      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name" className={FIELD_LABEL_CLASSES}>
            Nombre
          </Label>
          <Input
            id="name"
            placeholder="Biblioteca comunitaria en Ciudad Bolívar"
            value={values.name}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(event) => updateField("name", event.target.value)}
            aria-invalid={fieldErrors.name ? true : undefined}
            className={cn("bg-secondary", INVALID_FIELD_CLASSES)}
          />
          <FieldError message={fieldErrors.name} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className={FIELD_LABEL_CLASSES}>
            Descripción
          </Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Qué se va a hacer, para quién, y en qué se usa la plata."
            value={values.description}
            maxLength={MAX_TEXT_LENGTH}
            onChange={(event) => updateField("description", event.target.value)}
            aria-invalid={fieldErrors.description ? true : undefined}
            className={cn("resize-y bg-secondary", INVALID_FIELD_CLASSES)}
          />
          <FieldError message={fieldErrors.description} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amountGoal" className={FIELD_LABEL_CLASSES}>
            Meta en COP
          </Label>
          <Input
            id="amountGoal"
            type="number"
            step="0.01"
            min="0"
            placeholder="12000000"
            value={values.amountGoal}
            onChange={(event) => updateField("amountGoal", event.target.value)}
            aria-invalid={fieldErrors.amountGoal ? true : undefined}
            className={cn("bg-secondary", INVALID_FIELD_CLASSES)}
          />
          <p className="text-[12.5px] text-[var(--ink-faint)]">
            {values.amountGoal && goalValue > 0
              ? `Meta: ${formatCurrencyCOP(goalValue)}`
              : "Escribí el monto en pesos, sin puntos."}
            {currentCampaign &&
              ` · Recaudado hasta ahora: ${formatCurrencyCOP(currentCampaign.amountRaised)}`}
          </p>
          {showGoalNotice && (
            <NoticeAlert className="mt-2.5 text-[13px]">
              Si cambiás la meta, la campaña puede pasar a Completada o volver
              a Activa según lo recaudado.
            </NoticeAlert>
          )}
          <FieldError message={fieldErrors.amountGoal} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className={FIELD_LABEL_CLASSES}>Categorías</Label>

          {categoriesLoading && (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton key={index} className="h-[35px] w-24 rounded-full" />
              ))}
            </div>
          )}

          {!categoriesLoading && categoriesError && (
            <div className="flex items-center gap-3 rounded-lg border border-[var(--danger-border)] bg-[var(--danger-bg)] px-3 py-2.5 text-[13.5px] text-destructive">
              <span>{categoriesError}</span>
              <button
                type="button"
                onClick={reloadCategories}
                className="shrink-0 rounded-md border border-[var(--accent-soft-border)] bg-white px-2.5 py-1 text-[13px] font-medium text-destructive"
              >
                Reintentar
              </button>
            </div>
          )}

          {!categoriesLoading && !categoriesError && (
            <CategorySelectChips
              categories={categories}
              selectedIds={values.categoryIds}
              onToggle={toggleCategory}
              maxSelected={MAX_CATEGORIES}
            />
          )}

          <p className="text-[12.5px] text-[var(--ink-faint)]">
            {values.categoryIds.length >= MAX_CATEGORIES
              ? "Llegaste al máximo de 5 categorías."
              : `Elegí entre 1 y 5 categorías. Seleccionadas: ${values.categoryIds.length}.`}
          </p>
          <FieldError message={fieldErrors.categoryIds} />
        </div>

        <div className="mt-2 flex items-center gap-3">
          {cancelHref && (
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => router.push(cancelHref)}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitLabel}
          </Button>
          {submitting && (
            <span className="animate-pulse text-[13px] text-muted-foreground opacity-85">
              {pendingLabel}
            </span>
          )}
        </div>
      </form>
    </>
  );
}
