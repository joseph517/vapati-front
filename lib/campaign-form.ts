import { checkAmountFormat } from "@/lib/amount";

export type CampaignFieldKey =
  | "name"
  | "description"
  | "amountGoal"
  | "categoryIds";

export type CampaignFormValues = {
  name: string;
  description: string;
  amountGoal: string; // raw input text
  categoryIds: number[];
};

export type CampaignFormErrors = {
  formError: string | null;
  fieldErrors: Partial<Record<CampaignFieldKey, string>>;
};

export const MAX_TEXT_LENGTH = 255;
export const MAX_CATEGORIES = 5;

// Labels for the "Revisá estos campos: …" summary. They match the form's labels.
export const CAMPAIGN_FIELD_LABELS: Record<CampaignFieldKey, string> = {
  name: "Nombre",
  description: "Descripción",
  amountGoal: "Meta en COP",
  categoryIds: "Categorías",
};

export function checkGoalFormat(raw: string): string | null {
  switch (checkAmountFormat(raw)) {
    case "too-many-decimals":
      return "La meta admite hasta 2 decimales.";
    case "too-large":
      return "La meta es demasiado grande.";
    default:
      return null;
  }
}

// Returns null when the form is valid. The first failing rule wins.
export function validateCampaignForm(
  values: CampaignFormValues
): CampaignFormErrors | null {
  if (!values.name.trim() || !values.description.trim()) {
    return {
      formError: "El nombre y la descripción son obligatorios.",
      fieldErrors: {},
    };
  }
  if (!values.amountGoal || Number(values.amountGoal) <= 0) {
    return { formError: "La meta tiene que ser mayor a 0.", fieldErrors: {} };
  }
  const goalFormatError = checkGoalFormat(values.amountGoal);
  if (goalFormatError) {
    return { formError: null, fieldErrors: { amountGoal: goalFormatError } };
  }
  if (
    values.categoryIds.length === 0 ||
    values.categoryIds.length > MAX_CATEGORIES
  ) {
    return {
      formError: "Elegí al menos una categoría (máximo 5).",
      fieldErrors: {},
    };
  }
  return null;
}
