import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiError } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export class ApiClientError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string | null;
};

type RequestOptions = Omit<ApiFetchOptions, "accessToken">;

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { accessToken, ...requestOptions } = options;

  try {
    return await request<T>(path, requestOptions, accessToken ?? null);
  } catch (error) {
    if (
      error instanceof ApiClientError &&
      error.status === 401 &&
      accessToken
    ) {
      useAuthStore.getState().expireSession();
    }
    throw error;
  }
}

// fetch + body parsing + typed error. No auth logic here.
async function request<T>(
  path: string,
  options: RequestOptions,
  bearer: string | null
): Promise<T> {
  const { body, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (bearer) {
    requestHeaders.set("Authorization", `Bearer ${bearer}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiClientError(
      0,
      "No pudimos conectar con el servidor. Verificá tu conexión."
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const rawBody = await response.text();
  const parsedBody = rawBody ? safeJsonParse(rawBody) : null;

  if (!response.ok) {
    throw toApiClientError(response.status, parsedBody as ApiError | null);
  }

  return parsedBody as T;
}

// Single place that builds an ApiClientError from a response body.
function toApiClientError(
  status: number,
  apiError: ApiError | null
): ApiClientError {
  const message =
    apiError?.message ??
    apiError?.error ??
    "Ocurrió un error inesperado. Intentá de nuevo.";
  return new ApiClientError(status, message);
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
