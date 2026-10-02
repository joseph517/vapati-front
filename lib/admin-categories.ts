import { ApiClientError } from "@/lib/api";
import type {
  CategoryDTO,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "@/lib/types";

export const CATEGORY_TEXT_MAX_LENGTH = 255;
export const CATEGORY_NAME_REQUIRED_MESSAGE = "Escribí un nombre.";

export type CategoryFormValues = { name: string; description: string };

// The backend does not guarantee any order. Used as `select` of useApiQuery.
export function sortCategoriesByName(categories: CategoryDTO[]): CategoryDTO[] {
  return [...categories].sort((a, b) => a.name.localeCompare(b.name, "es"));
}

// "1 categoría" / "{n} categorías"
export function categoryCountLabel(count: number): string {
  return count === 1 ? "1 categoría" : `${count} categorías`;
}

// The backend does not trim. An empty description is omitted, so it stores null.
export function toCreateCategoryRequest(
  values: CategoryFormValues
): CreateCategoryRequest {
  const description = values.description.trim();
  return {
    name: values.name.trim(),
    ...(description ? { description } : {}),
  };
}

// Both fields are always sent: "" clears the description.
export function toUpdateCategoryRequest(
  values: CategoryFormValues
): UpdateCategoryRequest {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
  };
}

// A null description counts as "".
export function isCategoryUnchanged(
  values: CategoryFormValues,
  original: CategoryDTO
): boolean {
  return (
    values.name.trim() === original.name &&
    values.description.trim() === (original.description ?? "")
  );
}

// Message for the name field: a duplicate name (409) or a 400 with fields.name.
export function categoryNameError(err: unknown): string | null {
  if (!(err instanceof ApiClientError)) return null;
  if (err.status === 409) return err.message;
  if (err.status === 400 && err.fields?.name) return err.fields.name;
  return null;
}

export function isCategoryNotFoundError(err: unknown): boolean {
  return err instanceof ApiClientError && err.status === 404;
}

// A rejected delete (the category is in use) responds 400 with the reason.
export function categoryDeleteBlockedMessage(err: unknown): string | null {
  return err instanceof ApiClientError && err.status === 400 ? err.message : null;
}
