export class ApiClientError extends Error {
  status: number;
  fields?: Record<string, string>; // per-field messages of a "Validation failed" 400

  constructor(
    status: number,
    message: string,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.fields = fields;
  }
}

// For failures that carry no ApiError (network, unexpected exceptions)
export const UNEXPECTED_ERROR_MESSAGE =
  "Ocurrió un error inesperado. Intentá de nuevo.";

// Error shape exposed to the UI by reads (useApiQuery) and mutation catches.
export type QueryError = {
  status: number; // ApiClientError.status (0 without a connection or on an unexpected exception)
  message: string;
};

export function toQueryError(err: unknown): QueryError {
  if (err instanceof ApiClientError) {
    return { status: err.status, message: err.message };
  }
  return { status: 0, message: UNEXPECTED_ERROR_MESSAGE };
}

export function toErrorMessage(err: unknown): string {
  return toQueryError(err).message;
}
