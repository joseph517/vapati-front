import { useCallback } from "react";
import { useApiQuery } from "@/lib/hooks/use-api-query";
import type { CategoryDTO } from "@/lib/types";

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
