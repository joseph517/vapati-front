import { useCallback, useEffect, useRef, useState } from "react";
import { toQueryError, type QueryError } from "@/domain/shared/errors";

type UseApiQueryOptions<TRaw, T> = {
  enabled?: boolean; // default true. false = no request, keeps what was loaded
  resetKeys?: unknown[]; // a change in any element discards what was loaded
  select?: (raw: TRaw) => T; // transforms the response (sort, extract a field)
};

type UseApiQueryResult<T> = {
  data: T | null;
  loading: boolean;
  error: QueryError | null;
  reload: (options?: { background?: boolean }) => void;
};

type QueryState<T> = {
  key: string | null; // identity the loaded data belongs to
  resetKeys: unknown[];
  data: T | null;
  error: QueryError | null;
  stale: boolean; // a request is due or in flight
  background: boolean; // the due request leaves `loading` unchanged
  token: number; // bumps on every new request so the effect starts it
};

const NO_RESET_KEYS: unknown[] = [];

// GET with loading/error state. `key` is the request's identity (the service's
// key, the same as the path) and `null` = no request. Only the key decides when to
// fetch: the services read the current token when the request starts, so a token
// rotation does not refetch.
export function useApiQuery<TRaw, T = TRaw>(
  key: string | null,
  fetcher: () => Promise<TRaw>,
  options: UseApiQueryOptions<TRaw, T> = {}
): UseApiQueryResult<T> {
  const { enabled = true, resetKeys = NO_RESET_KEYS, select } = options;

  // Read from refs so an inline `fetcher` or `select` doesn't refetch.
  const fetcherRef = useRef(fetcher);
  const selectRef = useRef(select);
  useEffect(() => {
    fetcherRef.current = fetcher;
    selectRef.current = select;
  });

  const [state, setState] = useState<QueryState<T>>(() => ({
    key,
    resetKeys,
    data: null,
    error: null,
    stale: true,
    background: false,
    token: 0,
  }));

  // Start over when the identity changes
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  if (state.key !== key || !sameKeys(state.resetKeys, resetKeys)) {
    setState((current) => ({
      key,
      resetKeys,
      data: null,
      error: null,
      stale: true,
      background: false,
      token: current.token + 1,
    }));
  }

  const { stale, token } = state;

  useEffect(() => {
    if (key === null || !enabled || !stale) return;
    let cancelled = false;

    fetcherRef
      .current()
      .then((raw) => {
        if (cancelled) return;
        const transform = selectRef.current;
        const data = transform ? transform(raw) : (raw as unknown as T);
        setState((current) => ({
          ...current,
          data,
          error: null,
          stale: false,
          background: false,
        }));
      })
      .catch((err) => {
        if (cancelled) return;
        setState((current) => ({
          ...current,
          error: toQueryError(err),
          stale: false,
          background: false,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [key, enabled, stale, token]);

  // Keeps `data`. A background reload leaves `loading` unchanged.
  const reload = useCallback(({ background = false } = {}) => {
    setState((current) => ({
      ...current,
      error: null,
      stale: true,
      background,
      token: current.token + 1,
    }));
  }, []);

  const nothingLoaded = state.data === null && state.error === null;
  const loading =
    key !== null && enabled && stale && (!state.background || nothingLoaded);

  return { data: state.data, loading, error: state.error, reload };
}

function sameKeys(a: unknown[], b: unknown[]): boolean {
  return a.length === b.length && a.every((key, i) => Object.is(key, b[i]));
}
