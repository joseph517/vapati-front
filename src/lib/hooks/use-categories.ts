import { useCallback } from "react";
import type { CategoryDTO } from "@/domain/categories/category.types";
import { useApiQuery } from "@/lib/hooks/use-api-query";

export function useCategories() {
  const { data, loading, error, reload: reloadQuery } = useApiQuery<
    CategoryDTO[]
  >("/api/categories/list", { public: true });

  const reload = useCallback(() => reloadQuery(), [reloadQuery]);

  return {
    categories: data ?? [],
    loading,
    error: error?.message ?? null,
    reload,
  };
}
