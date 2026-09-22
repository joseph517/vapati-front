"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CategorySelectChips } from "@/components/category-select-chips";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError, apiFetch } from "@/lib/api";
import { useCategories } from "@/lib/hooks/use-categories";
import { useAuthStore } from "@/lib/store/auth-store";
import { formatCurrencyCOP } from "@/lib/utils";

const FIELD_LABEL_CLASSES =
  "text-[11.5px] font-medium tracking-[.07em] text-[var(--ink-label)] uppercase";

const MAX_CATEGORIES = 5;

type CreateCampaignResponse = {
  message: string;
  campaignId: number;
  status: string;
};

export default function NewCampaignPage() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amountGoal, setAmountGoal] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const goalValue = Number(amountGoal);

  function toggleCategory(categoryId: number) {
    setCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !description.trim()) {
      setFormError("El nombre y la descripción son obligatorios.");
      return;
    }
    if (!amountGoal || goalValue <= 0) {
      setFormError("La meta tiene que ser mayor a 0.");
      return;
    }
    if (categoryIds.length === 0 || categoryIds.length > MAX_CATEGORIES) {
      setFormError("Elegí al menos una categoría (máximo 5).");
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      const data = await apiFetch<CreateCampaignResponse>(
        "/api/campaigns/create",
        {
          method: "POST",
          accessToken,
          body: { name, description, amountGoal: goalValue, categoryIds },
        }
      );
      router.push(`/campaigns/${data.campaignId}`);
    } catch (error) {
      setFormError(
        error instanceof ApiClientError
          ? error.message
          : "Ocurrió un error inesperado. Intentá de nuevo."
      );
    } finally {
      setSubmitting(false);
    }
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

      {formError && (
        <Alert
          variant="destructive"
          className="mb-5 border-[var(--danger-border)] bg-[var(--danger-bg)]"
        >
          <AlertDescription className="text-[13.5px]">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      <form
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
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="bg-secondary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className={FIELD_LABEL_CLASSES}>
            Descripción
          </Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Qué se va a hacer, para quién, y en qué se usa la plata."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="resize-y bg-secondary"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amountGoal" className={FIELD_LABEL_CLASSES}>
            Meta en COP
          </Label>
          <Input
            id="amountGoal"
            type="number"
            placeholder="12000000"
            value={amountGoal}
            onChange={(event) => setAmountGoal(event.target.value)}
            className="bg-secondary"
          />
          <p className="text-[12.5px] text-[var(--ink-faint)]">
            {amountGoal && goalValue > 0
              ? `Meta: ${formatCurrencyCOP(goalValue)}`
              : "Escribí el monto en pesos, sin puntos."}
          </p>
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
              selectedIds={categoryIds}
              onToggle={toggleCategory}
              maxSelected={MAX_CATEGORIES}
            />
          )}

          <p className="text-[12.5px] text-[var(--ink-faint)]">
            {categoryIds.length >= MAX_CATEGORIES
              ? "Llegaste al máximo de 5 categorías."
              : `Elegí entre 1 y 5 categorías. Seleccionadas: ${categoryIds.length}.`}
          </p>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <Button type="submit" disabled={submitting} className="flex-1">
            Publicar campaña
          </Button>
          {submitting && (
            <span className="animate-pulse text-[13px] text-muted-foreground opacity-85">
              enviando…
            </span>
          )}
        </div>
      </form>
    </main>
  );
}
