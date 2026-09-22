"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ApiClientError, apiFetch } from "@/lib/api";
import type { CategoryDTO } from "@/lib/types";
import { cn } from "@/lib/utils";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_LABEL_CLASSES =
  "text-[11.5px] font-medium tracking-[.07em] text-[var(--ink-label)] uppercase";

const STEP_LABELS = ["Datos personales", "Cuenta", "Intereses"] as const;
const TOTAL_STEPS = STEP_LABELS.length;

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [description, setDescription] = useState("");
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    setCategoriesLoading(true);
    setCategoriesError(null);
    apiFetch<CategoryDTO[]>("/api/categories/list")
      .then((data) => setCategories(data))
      .catch((error) => {
        setCategoriesError(
          error instanceof ApiClientError
            ? error.message
            : "Ocurrió un error inesperado. Intentá de nuevo."
        );
      })
      .finally(() => setCategoriesLoading(false));
  }

  function toggleCategory(id: number) {
    setCategoryIds((current) =>
      current.includes(id)
        ? current.filter((categoryId) => categoryId !== id)
        : [...current, id]
    );
  }

  function validateStep(target: 1 | 2): string | null {
    const missing: string[] = [];
    if (target === 1) {
      if (!firstName.trim()) missing.push("nombre");
      if (!lastName.trim()) missing.push("apellido");
    } else {
      if (!EMAIL_PATTERN.test(email.trim())) missing.push("un email válido");
      if (!userName.trim()) missing.push("usuario");
      if (password.length < 8)
        missing.push("una contraseña de al menos 8 caracteres");
    }

    if (missing.length === 0) return null;
    return `Falta ${missing.join(", ")}.`;
  }

  function firstInvalidStep(): 1 | 2 | null {
    if (validateStep(1)) return 1;
    if (validateStep(2)) return 2;
    return null;
  }

  function goToNextStep() {
    const validationError = validateStep(step === 3 ? 2 : step);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);
    setStep((current) => (current === 3 ? current : ((current + 1) as 1 | 2 | 3)));
  }

  function goToPreviousStep() {
    setFormError(null);
    setStep((current) => (current === 1 ? current : ((current - 1) as 1 | 2 | 3)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step !== 3) {
      goToNextStep();
      return;
    }

    const invalidStep = firstInvalidStep();
    if (invalidStep) {
      setStep(invalidStep);
      setFormError(validateStep(invalidStep));
      return;
    }

    setFormError(null);
    setSubmitting(true);
    try {
      await apiFetch("/api/users/create", {
        method: "POST",
        body: {
          user: { categoryIds },
          userInfo: {
            firstName,
            lastName,
            email,
            userName,
            password,
            phone,
            description,
            profilePicture,
          },
        },
      });
      router.push(
        `/login?flash=registered&email=${encodeURIComponent(email)}`
      );
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
    <main className="mx-auto flex max-w-[640px] flex-col px-6 py-12">
      <Link
        href="/login"
        className="mb-4 text-[13.5px] text-muted-foreground hover:text-foreground"
      >
        ← Volver a entrar
      </Link>
      <h1 className="font-serif text-[30px] leading-[1.15] font-medium tracking-[-0.015em] text-foreground">
        Registro
      </h1>
      <p className="mt-2 mb-7 text-sm text-muted-foreground">
        Después de registrarte te pedimos entrar con tu email y contraseña.
      </p>

      {formError && (
        <Alert
          variant="destructive"
          className="mb-5 border-[var(--danger-border)] bg-[var(--danger-bg)]"
        >
          <AlertTitle>Revisá estos campos</AlertTitle>
          <AlertDescription className="text-[13.5px]">
            {formError}
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-5">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
            {STEP_LABELS[step - 1]}
          </span>
          <span className="text-[12.5px] text-muted-foreground">
            Paso {step} de {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-[var(--divider)]">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-6"
      >
        {step === 1 && (
        <section>
          <h2 className="mb-3.5 text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
            Datos personales
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName" className={FIELD_LABEL_CLASSES}>
                Nombre
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName" className={FIELD_LABEL_CLASSES}>
                Apellido
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone" className={FIELD_LABEL_CLASSES}>
                Teléfono
              </Label>
              <Input
                id="phone"
                placeholder="+57 300 000 0000"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="profilePicture" className={FIELD_LABEL_CLASSES}>
                Foto de perfil
              </Label>
              <Input
                id="profilePicture"
                placeholder="URL"
                value={profilePicture}
                onChange={(event) => setProfilePicture(event.target.value)}
                className="bg-secondary"
              />
            </div>
          </div>
        </section>
        )}

        {step === 2 && (
        <section>
          <h2 className="mb-3.5 text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
            Cuenta
          </h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className={FIELD_LABEL_CLASSES}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="userName" className={FIELD_LABEL_CLASSES}>
                Usuario
              </Label>
              <Input
                id="userName"
                value={userName}
                onChange={(event) => setUserName(event.target.value)}
                className="bg-secondary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className={FIELD_LABEL_CLASSES}>
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="mínimo 8 caracteres"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="bg-secondary"
              />
            </div>
          </div>
          <div className="mt-3.5 flex flex-col gap-1.5">
            <Label htmlFor="description" className={FIELD_LABEL_CLASSES}>
              Sobre vos
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Una línea sobre qué causas te mueven"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="resize-y bg-secondary"
            />
          </div>
        </section>
        )}

        {step === 3 && (
        <section>
          <h2 className="mb-3.5 text-[11.5px] font-medium tracking-[.09em] text-[var(--ink-eyebrow)] uppercase">
            Intereses
          </h2>
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
                onClick={loadCategories}
                className="shrink-0 rounded-md border border-[var(--accent-soft-border)] bg-white px-2.5 py-1 text-[13px] font-medium text-destructive"
              >
                Reintentar
              </button>
            </div>
          )}

          {!categoriesLoading && !categoriesError && (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const active = categoryIds.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors",
                      active
                        ? "border-[var(--accent-soft-border)] bg-accent text-accent-foreground"
                        : "border-input bg-secondary text-muted-foreground"
                    )}
                  >
                    {category.name}
                  </button>
                );
              })}
            </div>
          )}
        </section>
        )}

        <div className="mt-[26px] flex items-center gap-3">
          {step === 1 && (
            <Button type="button" onClick={goToNextStep} className="flex-1">
              Continuar
            </Button>
          )}
          {step > 1 && (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={goToPreviousStep}
                disabled={submitting}
              >
                Atrás
              </Button>
              {step === 2 && (
                <Button type="button" onClick={goToNextStep} className="flex-1">
                  Continuar
                </Button>
              )}
              {step === 3 && (
                <Button type="submit" disabled={submitting} className="flex-1">
                  Crear cuenta
                </Button>
              )}
            </>
          )}
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
