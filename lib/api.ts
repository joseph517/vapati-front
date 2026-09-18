import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiError } from "@/lib/types";

const API_BASE_URL = "http://localhost:8080";

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

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { body, accessToken, headers, ...rest } = options;

  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }
  if (accessToken) {
    requestHeaders.set("Authorization", `Bearer ${accessToken}`);
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
      "No pudimos conectar con el servidor. Verificá que localhost:8080 esté disponible."
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const rawBody = await response.text();
  const parsedBody = rawBody ? safeJsonParse(rawBody) : null;

  if (!response.ok) {
    const apiError = parsedBody as ApiError | null;
    const message =
      apiError?.message ??
      apiError?.error ??
      "Ocurrió un error inesperado. Intentá de nuevo.";

    if (response.status === 401 && accessToken) {
      useAuthStore.getState().expireSession();
    }

    throw new ApiClientError(response.status, message);
  }

  return parsedBody as T;
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
