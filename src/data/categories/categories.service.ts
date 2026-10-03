import { apiFetch } from "@/data/providers/http-client";
import type { CategoryDTO } from "@/domain/categories/category.types";

const keys = {
  list: () => "/api/categories/list",
};

export const categoriesService = {
  keys,
  // Public: sent without the JWT
  list: () => apiFetch<CategoryDTO[]>(keys.list()),
};
