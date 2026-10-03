import { adminCategoriesService } from "@/data/admin/admin-categories.service";

// Module-level, so the object and its functions are the same on every render
const adminCategoryActions = {
  create: adminCategoriesService.create,
  update: adminCategoriesService.update,
  remove: adminCategoriesService.remove,
};

export function useAdminCategoryActions() {
  return adminCategoryActions;
}
