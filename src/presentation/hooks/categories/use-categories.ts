import { useCallback } from "react";
import { categoriesService } from "@/data/categories/categories.service";
import { useApiQuery } from "@/presentation/hooks/shared/use-api-query";

export function useCategories() {
  const { data, loading, error, reload: reloadQuery } = useApiQuery(
    categoriesService.keys.list(),
    categoriesService.list
  );

  const reload = useCallback(() => reloadQuery(), [reloadQuery]);

  return {
    categories: data ?? [],
    loading,
    error: error?.message ?? null,
    reload,
  };
}
