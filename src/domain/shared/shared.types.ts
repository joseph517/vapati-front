export type ApiError = {
  error: string;
  message: string;
  timestamp: string;
  fields?: Record<string, string>; // only when error === "Validation failed"
  path?: string; // only on the unauthenticated 401 and the blocked-account 403
};

// Spring Data Page as serialized by Spring Boot 3.2 (PageImpl). Only the fields we read.
export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page, 0-based
  size: number;
}

export type SortDirection = "asc" | "desc";

export type LoadStatus = "loading" | "ready" | "error";
