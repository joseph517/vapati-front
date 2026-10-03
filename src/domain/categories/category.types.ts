export type CategoryDTO = {
  id: number;
  name: string;
  description: string | null; // null when it was never set
};

// POST /api/categories/create
export type CreateCategoryRequest = {
  name: string; // trimmed, not empty, max 255
  description?: string; // trimmed, max 255. Omitted when empty, so the backend stores null
};

// PUT /api/categories/update/{id}. Both fields are always sent:
// "" clears the description (null would keep the current one).
export type UpdateCategoryRequest = {
  name: string;
  description: string;
};

export type DeleteCategoryResponse = {
  message: string; // "Category deleted successfully"
  categoryId: number;
};
