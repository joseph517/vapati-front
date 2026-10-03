import { auth } from "@/data/auth/session-store";
import { apiFetch } from "@/data/providers/http-client";
import type {
  CategoryDTO,
  CreateCategoryRequest,
  DeleteCategoryResponse,
  UpdateCategoryRequest,
} from "@/domain/categories/category.types";

// ADMIN only: the backend answers 403 to anyone else. The list is categoriesService.list
export const adminCategoriesService = {
  create: (body: CreateCategoryRequest) =>
    apiFetch<CategoryDTO>("/api/categories/create", {
      method: "POST",
      body,
      ...auth(),
    }),
  update: (id: number, body: UpdateCategoryRequest) =>
    apiFetch<CategoryDTO>(`/api/categories/update/${id}`, {
      method: "PUT",
      body,
      ...auth(),
    }),
  remove: (id: number) =>
    apiFetch<DeleteCategoryResponse>(`/api/categories/delete/${id}`, {
      method: "DELETE",
      ...auth(),
    }),
};
