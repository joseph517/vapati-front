import { isTokenExpired } from "@/lib/jwt";
import { useAuthStore } from "@/lib/store/auth-store";
import type { ApiError, AuthResponse } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

type ApiFetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  accessToken?: string | null;
};

type RequestOptions = Omit<ApiFetchOptions, "accessToken">;

const SESSION_EXPIRED_MESSAGE = "Tu sesión expiró. Volvé a entrar.";

// For failures that carry no ApiError (network, unexpected exceptions)
export const UNEXPECTED_ERROR_MESSAGE =
  "Ocurrió un error inesperado. Intentá de nuevo.";

// Message prefixes the backend uses for a 403 caused by a banned or suspended account.
const BLOCKED_PREFIXES = [
  "Your account has been banned",
  "Your account is suspended until",
];

// Only one refresh at a time: concurrent callers share this promise.
let refreshPromise: Promise<void> | null = null;

// A truthy `accessToken` option marks the request as authenticated. The token
// actually sent is always read from the store, so retries and stale closures
// use the current one. Without it the request is public and has no auth logic.
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { accessToken, ...requestOptions } = options;

  if (!accessToken) {
    return request<T>(path, requestOptions, null);
  }

  return authenticatedFetch<T>(path, requestOptions);
}

async function authenticatedFetch<T>(
  path: string,
  options: RequestOptions
): Promise<T> {
  if (refreshPromise) {
    await refreshPromise;
  }

  const storedToken = useAuthStore.getState().accessToken;
  if (storedToken && isTokenExpired(storedToken)) {
    await refreshSession();
  }

  try {
    return await request<T>(path, options, currentAccessToken());
  } catch (error) {
    if (!(error instanceof ApiClientError)) throw error;

    if (isBlockedError(error)) {
      useAuthStore.getState().blockSession(error.message);
      throw error;
    }
    if (error.status !== 401) throw error;
  }

  await refreshSession();

  try {
    return await request<T>(path, options, currentAccessToken());
  } catch (error) {
    if (error instanceof ApiClientError) {
      if (isBlockedError(error)) {
        useAuthStore.getState().blockSession(error.message);
      } else if (error.status === 401) {
        useAuthStore.getState().expireSession();
      }
    }
    throw error;
  }
}

function currentAccessToken(): string {
  const token = useAuthStore.getState().accessToken;
  if (!token) {
    throw new ApiClientError(401, SESSION_EXPIRED_MESSAGE);
  }
  return token;
}

function refreshSession(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = runRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function runRefresh(): Promise<void> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    useAuthStore.getState().expireSession();
    throw new ApiClientError(401, SESSION_EXPIRED_MESSAGE);
  }

  try {
    const auth = await request<AuthResponse>(
      "/auth/refresh-token",
      { method: "POST", body: { refreshToken } },
      null
    );
    useAuthStore.getState().setSession(auth);
  } catch (error) {
    // Network errors (status 0) and 5xx keep the session so the next request can retry.
    if (error instanceof ApiClientError) {
      if (isBlockedError(error)) {
        useAuthStore.getState().blockSession(error.message);
      } else if (error.status === 401 || error.status === 403) {
        useAuthStore.getState().expireSession();
      }
    }
    throw error;
  }
}

function isBlockedError(error: ApiClientError): boolean {
  return (
    error.status === 403 &&
    BLOCKED_PREFIXES.some((prefix) => error.message.startsWith(prefix))
  );
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
  return new ApiClientError(status, message, apiError?.fields);
}

function safeJsonParse(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
