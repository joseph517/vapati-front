"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CredentialsConfirmSection } from "@/components/credentials-confirm-section";
import { FieldError } from "@/components/field-error";
import { FormTextField } from "@/components/form-text-field";
import { InterestsPicker } from "@/components/interests-picker";
import { PasswordRulesChecklist } from "@/components/password-rules-checklist";
import { ProfileFormSection } from "@/components/profile-form-section";
import { ProfilePictureField } from "@/components/profile-picture-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { CategoryDTO } from "@/domain/categories/category.types";
import {
  ApiClientError,
  UNEXPECTED_ERROR_MESSAGE,
} from "@/domain/shared/errors";
import type { UpdateUserRequest, UserDTO } from "@/domain/users/user.types";
import { FIELD_LABEL_CLASSES, INVALID_FIELD_CLASSES } from "@/lib/form-classes";
import {
  buildUpdateUserRequest,
  getCredentialsChange,
  PROFILE_FIELD_LABELS,
  toProfileFormValues,
  validateProfileForm,
  type CredentialsChange,
  type ProfileFieldErrors,
  type ProfileFieldKey,
  type ProfileFormValues,
} from "@/lib/profile-form";
import { cn } from "@/lib/utils";
import { MAX_INTERESTS, USER_MAX_LENGTHS } from "@/lib/validation/user";

const FIELDS_GRID_CLASSES =
  "grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3.5";

interface ProfileEditFormProps {
  user: UserDTO;
  categories: CategoryDTO[];
  onSubmit: (
    request: UpdateUserRequest,
    change: CredentialsChange
  ) => Promise<void>;
}

export function ProfileEditForm({
  user,
  categories,
  onSubmit,
}: ProfileEditFormProps) {
  const router = useRouter();

  const [initial] = useState<ProfileFormValues>(() =>
    toProfileFormValues(user, categories)
  );
  const [values, setValues] = useState<ProfileFormValues>(initial);
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [serverFieldKeys, setServerFieldKeys] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Recomputed on every render: the confirm section follows what is typed.
  const credentialsChange = getCredentialsChange(values, initial);

  function updateField<K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K]
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
    const { categoryIds } = values;
    if (categoryIds.includes(categoryId)) {
      updateField(
        "categoryIds",
        categoryIds.filter((id) => id !== categoryId)
      );
    } else if (categoryIds.length < MAX_INTERESTS) {
      updateField("categoryIds", [...categoryIds, categoryId]);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateProfileForm(values, initial);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(null);
      setServerFieldKeys([]);
      return;
    }

    const request = buildUpdateUserRequest(values, initial);
    if (Object.keys(request).length === 0) {
      router.push("/profile");
      return;
    }

    setFormError(null);
    setFieldErrors({});
    setServerFieldKeys([]);
    setSubmitting(true);
    try {
      await onSubmit(request, credentialsChange);
      // On success the page navigates away, so the form stays in "guardando…".
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
    .map((key) => PROFILE_FIELD_LABELS[key as ProfileFieldKey] ?? key)
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
        className="rounded-xl border border-border bg-card p-6"
      >
        <ProfileFormSection title="Datos personales" first>
          <div className={FIELDS_GRID_CLASSES}>
            <FormTextField
              id="firstName"
              label="Nombre"
              value={values.firstName}
              onChange={(value) => updateField("firstName", value)}
              error={fieldErrors.firstName}
              maxLength={USER_MAX_LENGTHS.firstName}
              autoComplete="given-name"
            />
            <FormTextField
              id="lastName"
              label="Apellido"
              value={values.lastName}
              onChange={(value) => updateField("lastName", value)}
              error={fieldErrors.lastName}
              maxLength={USER_MAX_LENGTHS.lastName}
              autoComplete="family-name"
            />
            <FormTextField
              id="phone"
              label="Teléfono"
              value={values.phone}
              onChange={(value) => updateField("phone", value)}
              error={fieldErrors.phone}
              maxLength={USER_MAX_LENGTHS.phone}
              autoComplete="tel"
            />
            <ProfilePictureField
              value={values.profilePicture}
              onChange={(value) => updateField("profilePicture", value)}
              error={fieldErrors.profilePicture}
              firstName={values.firstName}
              lastName={values.lastName}
            />
          </div>
        </ProfileFormSection>

        <ProfileFormSection title="Cuenta">
          <div className={FIELDS_GRID_CLASSES}>
            <FormTextField
              id="email"
              label="Email"
              type="email"
              value={values.email}
              onChange={(value) => updateField("email", value)}
              error={fieldErrors.email}
              maxLength={USER_MAX_LENGTHS.email}
              autoComplete="email"
            />
            <FormTextField
              id="userName"
              label="Usuario"
              value={values.userName}
              onChange={(value) => updateField("userName", value)}
              error={fieldErrors.userName}
              autoComplete="username"
            />
          </div>
          <div className="mt-3.5 flex flex-col gap-1.5">
            <Label htmlFor="description" className={FIELD_LABEL_CLASSES}>
              Sobre vos
            </Label>
            <Textarea
              id="description"
              rows={3}
              maxLength={USER_MAX_LENGTHS.description}
              value={values.description}
              aria-invalid={fieldErrors.description ? true : undefined}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              className={cn("resize-y bg-secondary", INVALID_FIELD_CLASSES)}
            />
            <p className="text-[12.5px] text-[var(--ink-faint)]">
              Si lo dejás vacío, se borra de tu perfil.
            </p>
            <FieldError message={fieldErrors.description} />
          </div>
        </ProfileFormSection>

        <ProfileFormSection title="Intereses">
          <InterestsPicker
            categories={categories}
            loading={false}
            error={null}
            onRetry={() => {}}
            selectedIds={values.categoryIds}
            onToggle={toggleCategory}
          />
          <FieldError message={fieldErrors.categoryIds} />
        </ProfileFormSection>

        <ProfileFormSection
          title="Contraseña"
          description="Dejalas vacías si no querés cambiarla."
        >
          <div className={FIELDS_GRID_CLASSES}>
            <FormTextField
              id="password"
              label="Nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={values.password}
              onChange={(value) => updateField("password", value)}
              // Its message goes below the checklist.
              error={Boolean(fieldErrors.password)}
            />
            <FormTextField
              id="confirmPassword"
              label="Repetir nueva contraseña"
              type="password"
              autoComplete="new-password"
              value={values.confirmPassword}
              onChange={(value) => updateField("confirmPassword", value)}
              error={fieldErrors.confirmPassword}
            />
          </div>
          <PasswordRulesChecklist password={values.password} />
          <FieldError message={fieldErrors.password} />
        </ProfileFormSection>

        {credentialsChange !== null && (
          <CredentialsConfirmSection
            change={credentialsChange}
            value={values.currentPassword}
            onChange={(value) => updateField("currentPassword", value)}
            error={fieldErrors.currentPassword}
          />
        )}

        <div className="mt-[26px] flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={submitting}
            onClick={() => router.push("/profile")}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            Guardar cambios
          </Button>
          {submitting && (
            <span className="animate-pulse text-[13px] text-muted-foreground opacity-85">
              guardando…
            </span>
          )}
        </div>
      </form>
    </>
  );
}
