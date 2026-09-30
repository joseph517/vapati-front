// User field rules shared by the register and edit-profile forms (backend spec 35).

export const USER_MAX_LENGTHS = {
  firstName: 255,
  lastName: 255,
  profilePicture: 255,
  description: 255,
  email: 254,
  phone: 20,
} as const;

export const MIN_INTERESTS = 1;
export const MAX_INTERESTS = 6;

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const USERNAME_PATTERN = /^[a-zA-Z0-9._-]{3,50}$/;
export const PASSWORD_SPECIAL_CHARS = '! @ # $ % ^ & * ( ) , . ? " : { } | < >';

export type PasswordRuleId = "length" | "upper" | "lower" | "digit" | "special";

export interface PasswordRule {
  id: PasswordRuleId;
  label: string;
  test: (password: string) => boolean;
}

// In the checklist's display order. The `u` flag is required by \p{…}.
export const PASSWORD_RULES: PasswordRule[] = [
  { id: "length", label: "8 caracteres", test: (p) => p.length >= 8 },
  { id: "upper", label: "una mayúscula", test: (p) => /\p{Lu}/u.test(p) },
  { id: "lower", label: "una minúscula", test: (p) => /\p{Ll}/u.test(p) },
  { id: "digit", label: "un número", test: (p) => /\p{Nd}/u.test(p) },
  {
    id: "special",
    label: "un carácter especial",
    test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p),
  },
];

export const USERNAME_RULE_MESSAGE =
  "El usuario tiene que tener entre 3 y 50 caracteres: letras, números, '.', '_' o '-'.";
export const PASSWORD_RULE_MESSAGE =
  'La contraseña necesita al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (! @ # $ % ^ & * ( ) , . ? " : { } | < >).';
export const INTERESTS_RULE_MESSAGE = "Elegí entre 1 y 6 intereses.";

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export function isValidUserName(value: string): boolean {
  return USERNAME_PATTERN.test(value.trim());
}

export function isValidPassword(value: string): boolean {
  return PASSWORD_RULES.every((rule) => rule.test(value));
}

export function isValidInterestCount(count: number): boolean {
  return count >= MIN_INTERESTS && count <= MAX_INTERESTS;
}

export function getInterestsHint(count: number): string {
  if (count >= MAX_INTERESTS) {
    return "Llegaste al máximo de 6 intereses. Sacá uno para elegir otro.";
  }
  return `Elegí entre 1 y 6 intereses. Seleccionados: ${count}.`;
}
