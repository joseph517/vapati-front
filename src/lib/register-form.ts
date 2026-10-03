import type { ApiClientError } from "@/domain/shared/errors";
import {
  INTERESTS_RULE_MESSAGE,
  isValidEmail,
  isValidInterestCount,
  isValidPassword,
  isValidUserName,
  PASSWORD_RULE_MESSAGE,
  USERNAME_RULE_MESSAGE,
} from "@/lib/validation/user";

export type RegisterStep = 1 | 2 | 3;

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  phone: string;
  profilePicture: string;
  email: string;
  userName: string;
  password: string;
  description: string;
  categoryIds: number[];
}

function missingMessage(missing: string[]): string[] {
  return missing.length > 0 ? [`Falta ${missing.join(", ")}.`] : [];
}

// Paragraphs for the alert. [] = valid.
// An empty field goes to the "Falta …" list; a filled but invalid one gets its rule paragraph.
export function validateRegisterStep(
  step: RegisterStep,
  values: RegisterFormValues
): string[] {
  if (step === 1) {
    const missing: string[] = [];
    if (!values.firstName.trim()) missing.push("nombre");
    if (!values.lastName.trim()) missing.push("apellido");
    if (!values.phone.trim()) missing.push("teléfono");
    return missingMessage(missing);
  }

  if (step === 2) {
    const missing: string[] = [];
    // Empty or invalid, the email reads the same.
    if (!isValidEmail(values.email)) missing.push("un email válido");
    if (!values.userName.trim()) missing.push("usuario");
    if (!values.password) missing.push("contraseña");

    const messages = missingMessage(missing);
    if (values.userName.trim() && !isValidUserName(values.userName)) {
      messages.push(USERNAME_RULE_MESSAGE);
    }
    if (values.password && !isValidPassword(values.password)) {
      messages.push(PASSWORD_RULE_MESSAGE);
    }
    return messages;
  }

  return isValidInterestCount(values.categoryIds.length)
    ? []
    : [INTERESTS_RULE_MESSAGE];
}

// Backend field key → form label.
export const REGISTER_FIELD_LABELS: Record<string, string> = {
  "userInfo.firstName": "Nombre",
  "userInfo.lastName": "Apellido",
  "userInfo.phone": "Teléfono",
  "userInfo.profilePicture": "Foto de perfil",
  "userInfo.email": "Email",
  "userInfo.userName": "Usuario",
  "userInfo.password": "Contraseña",
  "userInfo.description": "Sobre vos",
  user: "Intereses",
  "user.categoryIds": "Intereses",
};

const FIELD_STEPS: Record<string, RegisterStep> = {
  "userInfo.firstName": 1,
  "userInfo.lastName": 1,
  "userInfo.phone": 1,
  "userInfo.profilePicture": 1,
  "userInfo.email": 2,
  "userInfo.userName": 2,
  "userInfo.password": 2,
  "userInfo.description": 2,
  user: 3,
  "user.categoryIds": 3,
};

// For errors without `fields`, matched by message prefix.
const MESSAGE_PREFIX_STEPS: [prefix: string, step: RegisterStep][] = [
  ["Invalid email format", 2],
  ["Username", 2],
  ["Password", 2],
  ["Email already exists", 2],
  ["Phone already exists", 1],
  ["User must have", 3],
  ["User cannot have", 3],
  ["Categories not found", 3],
];

// The step where the error belongs, or null if unknown.
export function getRegisterErrorStep(
  error: ApiClientError
): RegisterStep | null {
  if (error.fields) {
    const knownKey = Object.keys(error.fields).find((key) => key in FIELD_STEPS);
    return knownKey ? FIELD_STEPS[knownKey] : null;
  }
  const match = MESSAGE_PREFIX_STEPS.find(([prefix]) =>
    error.message.startsWith(prefix)
  );
  return match ? match[1] : null;
}

// One "{label}: {message}" per field of `step`. Without fields, or when none
// belongs to `step`, the backend message as is.
export function getRegisterErrorMessages(
  error: ApiClientError,
  step: RegisterStep
): string[] {
  const stepMessages = Object.entries(error.fields ?? {})
    .filter(([key]) => FIELD_STEPS[key] === step)
    .map(
      ([key, message]) => `${REGISTER_FIELD_LABELS[key] ?? key}: ${message}`
    );
  return stepMessages.length > 0 ? stepMessages : [error.message];
}
