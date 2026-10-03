"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { InterestsPicker } from "@/components/interests-picker";
import { PasswordRulesChecklist } from "@/components/password-rules-checklist";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usersService } from "@/data/users/users.service";
import {
  ApiClientError,
  UNEXPECTED_ERROR_MESSAGE,
} from "@/domain/shared/errors";
import {
  getRegisterErrorMessages,
  getRegisterErrorStep,
  validateRegisterStep,
  type RegisterFormValues,
  type RegisterStep,
} from "@/domain/users/register-form";
import {
  MAX_INTERESTS,
  USER_MAX_LENGTHS,
} from "@/domain/users/user-validation";
import type { CreateUserRequest } from "@/domain/users/user.types";
import { useCategories } from "@/presentation/hooks/categories/use-categories";
import { cn } from "@/presentation/utils/cn";
import { FIELD_LABEL_CLASSES } from "@/presentation/utils/form-classes";

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
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [step, setStep] = useState<RegisterStep>(1);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();

  const values: RegisterFormValues = {
    firstName,
    lastName,
    phone,
    profilePicture,
    email,
    userName,
    password,
    description,
    categoryIds,
  };

  function toggleCategory(id: number) {
    setCategoryIds((current) => {
      if (current.includes(id)) {
        return current.filter((categoryId) => categoryId !== id);
      }
      return current.length >= MAX_INTERESTS ? current : [...current, id];
    });
  }

  function goToNextStep() {
    const messages = validateRegisterStep(step === 3 ? 2 : step, values);
    if (messages.length > 0) {
      setFormErrors(messages);
      return;
    }
    setFormErrors([]);
    setStep((current) => (current === 3 ? current : ((current + 1) as RegisterStep)));
  }

  function goToPreviousStep() {
    setFormErrors([]);
    setStep((current) => (current === 1 ? current : ((current - 1) as RegisterStep)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step !== 3) {
      goToNextStep();
      return;
    }

    for (const target of [1, 2, 3] as const) {
      const messages = validateRegisterStep(target, values);
      if (messages.length > 0) {
        setStep(target);
        setFormErrors(messages);
        return;
      }
    }

    const trimmedEmail = email.trim();
    const body: CreateUserRequest = {
      user: { categoryIds },
      userInfo: {
        firstName,
        lastName,
        email: trimmedEmail,
        userName: userName.trim(),
        password,
        phone: phone.trim(),
        description,
        profilePicture,
      },
    };

    setFormErrors([]);
    setSubmitting(true);
    try {
      await usersService.create(body);
      router.push(
        `/login?flash=registered&email=${encodeURIComponent(trimmedEmail)}`
      );
    } catch (error) {
      if (error instanceof ApiClientError) {
        const target = getRegisterErrorStep(error) ?? step;
        setStep(target);
        setFormErrors(getRegisterErrorMessages(error, target));
        if (error.message.startsWith("Categories not found")) {
          reloadCategories();
        }
      } else {
        setFormErrors([UNEXPECTED_ERROR_MESSAGE]);
      }
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

      {formErrors.length > 0 && (
        <Alert
          variant="destructive"
          className="mb-5 border-[var(--danger-border)] bg-[var(--danger-bg)]"
        >
          <AlertTitle>Revisá estos campos</AlertTitle>
          <AlertDescription className="text-[13.5px] [&_p:not(:last-child)]:mb-0">
            {formErrors.map((message, index) => (
              <p key={index} className={cn(index > 0 && "mt-1")}>
                {message}
              </p>
            ))}
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
                maxLength={USER_MAX_LENGTHS.firstName}
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
                maxLength={USER_MAX_LENGTHS.lastName}
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
                maxLength={USER_MAX_LENGTHS.phone}
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
                maxLength={USER_MAX_LENGTHS.profilePicture}
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
          <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-3.5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className={FIELD_LABEL_CLASSES}>
                Email
              </Label>
              <Input
                id="email"
                maxLength={USER_MAX_LENGTHS.email}
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
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="bg-secondary"
              />
            </div>
          </div>
          <PasswordRulesChecklist password={password} />
          <div className="mt-3.5 flex flex-col gap-1.5">
            <Label htmlFor="description" className={FIELD_LABEL_CLASSES}>
              Sobre vos
            </Label>
            <Textarea
              id="description"
              maxLength={USER_MAX_LENGTHS.description}
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
          <InterestsPicker
            categories={categories}
            loading={categoriesLoading}
            error={categoriesError}
            onRetry={reloadCategories}
            selectedIds={categoryIds}
            onToggle={toggleCategory}
          />
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
