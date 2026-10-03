import type { CategoryDTO, UpdateUserRequest, UserDTO } from "@/lib/types";
import {
  INTERESTS_RULE_MESSAGE,
  isValidEmail,
  isValidInterestCount,
  isValidPassword,
  isValidUserName,
  PASSWORD_RULE_MESSAGE,
  USERNAME_RULE_MESSAGE,
} from "@/lib/validation/user";

export type ProfileFieldKey =
  | "firstName"
  | "lastName"
  | "phone"
  | "profilePicture"
  | "email"
  | "userName"
  | "description"
  | "categoryIds"
  | "password"
  | "confirmPassword"
  | "currentPassword";

export interface ProfileFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  profilePicture: string; // null from the backend → ""
  email: string;
  userName: string;
  description: string;
  categoryIds: number[];
  password: string; // "Nueva contraseña". Empty = no change
  confirmPassword: string; // client only, never sent
  currentPassword: string;
}

export type ProfileFieldErrors = Partial<Record<ProfileFieldKey, string>>;

// Labels for the "Revisá estos campos: …" summary. They match the form's labels.
export const PROFILE_FIELD_LABELS: Record<ProfileFieldKey, string> = {
  firstName: "Nombre",
  lastName: "Apellido",
  phone: "Teléfono",
  profilePicture: "Foto de perfil",
  email: "Email",
  userName: "Usuario",
  description: "Sobre vos",
  categoryIds: "Intereses",
  password: "Nueva contraseña",
  confirmPassword: "Repetir nueva contraseña",
  currentPassword: "Contraseña actual",
};

export const REQUIRED_FIELD_MESSAGE = "Este campo es obligatorio.";
export const INVALID_EMAIL_MESSAGE = "Ingresá un email válido.";
export const PASSWORD_MISMATCH_MESSAGE = "Las contraseñas no coinciden.";
export const CURRENT_PASSWORD_REQUIRED_MESSAGE =
  "Ingresá tu contraseña actual para cambiar el email o la contraseña.";

const REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "email",
  "userName",
] as const;

// Category names → ids with the category list. Unknown names are dropped.
export function toProfileFormValues(
  user: UserDTO,
  categories: CategoryDTO[]
): ProfileFormValues {
  const { userInfo } = user;
  const categoryIds = user.categories.flatMap((name) => {
    const category = categories.find((candidate) => candidate.name === name);
    return category ? [category.id] : [];
  });

  return {
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    phone: userInfo.phone,
    profilePicture: userInfo.profilePicture ?? "",
    email: userInfo.email,
    userName: userInfo.userName,
    description: userInfo.description,
    categoryIds,
    password: "",
    confirmPassword: "",
    currentPassword: "",
  };
}

// An email that only changes case is not a change.
function emailChanged(values: ProfileFormValues, initial: ProfileFormValues) {
  return values.email.trim().toLowerCase() !== initial.email.toLowerCase();
}

function sameIds(a: number[], b: number[]) {
  return a.length === b.length && a.every((id) => b.includes(id));
}

export type CredentialsChange = "email" | "password" | "both" | null;

export function getCredentialsChange(
  values: ProfileFormValues,
  initial: ProfileFormValues
): CredentialsChange {
  const email = emailChanged(values, initial);
  const password = values.password !== "";
  if (email && password) return "both";
  if (email) return "email";
  if (password) return "password";
  return null;
}

const CREDENTIALS_CHANGE_TEXT: Record<Exclude<CredentialsChange, null>, string> = {
  email: "tu email",
  password: "tu contraseña",
  both: "tu email y tu contraseña",
};

export function getCredentialsNotice(
  change: Exclude<CredentialsChange, null>
): string {
  return `Cambiaste ${CREDENTIALS_CHANGE_TEXT[change]}. Al guardar se cierra la sesión y vas a tener que entrar de nuevo con los datos nuevos.`;
}

// All failing fields at once. {} = valid.
export function validateProfileForm(
  values: ProfileFormValues,
  initial: ProfileFormValues
): ProfileFieldErrors {
  const errors: ProfileFieldErrors = {};

  for (const key of REQUIRED_FIELDS) {
    if (!values[key].trim()) errors[key] = REQUIRED_FIELD_MESSAGE;
  }
  if (
    !errors.email &&
    emailChanged(values, initial) &&
    !isValidEmail(values.email)
  ) {
    errors.email = INVALID_EMAIL_MESSAGE;
  }
  if (
    !errors.userName &&
    values.userName.trim() !== initial.userName &&
    !isValidUserName(values.userName)
  ) {
    errors.userName = USERNAME_RULE_MESSAGE;
  }
  if (!isValidInterestCount(values.categoryIds.length)) {
    errors.categoryIds = INTERESTS_RULE_MESSAGE;
  }
  if (values.password && !isValidPassword(values.password)) {
    errors.password = PASSWORD_RULE_MESSAGE;
  }
  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = PASSWORD_MISMATCH_MESSAGE;
  }
  if (getCredentialsChange(values, initial) !== null && !values.currentPassword) {
    errors.currentPassword = CURRENT_PASSWORD_REQUIRED_MESSAGE;
  }

  return errors;
}

const TRIMMED_TEXT_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "userName",
  "description",
  "profilePicture",
] as const;

// Only what changed. {} = nothing changed (the form does not call the backend).
export function buildUpdateUserRequest(
  values: ProfileFormValues,
  initial: ProfileFormValues
): UpdateUserRequest {
  const request: UpdateUserRequest = {};

  for (const key of TRIMMED_TEXT_FIELDS) {
    const value = values[key].trim();
    if (value !== initial[key]) request[key] = value; // "" clears description and profilePicture
  }
  if (emailChanged(values, initial)) request.email = values.email.trim();
  if (!sameIds(values.categoryIds, initial.categoryIds)) {
    request.categoryIds = values.categoryIds;
  }
  if (values.password) request.password = values.password;
  if (getCredentialsChange(values, initial) !== null) {
    request.currentPassword = values.currentPassword;
  }

  return request;
}
