import {
  coerceArray,
  EmptyConfig,
  OrArray,
  PropsFactory,
  Query,
  Reducer,
  select,
  StateOf,
  Store,
  StoreDef,
} from '@ngneat/elf';

import { EMPTY, Observable, OperatorFunction } from 'rxjs';

export type RequestsCacheState = StateOf<typeof withRequestsCache>;
export type CacheRecordKeys<S> = S extends {
  requestsCache: Record<infer K, any>;
}
  ? K
  : string;

export type CacheState = {
  value: 'none' | 'partial' | 'full';
  timestamp?: number;
};

export function withRequestsCache<Keys extends string>(
  initialValue?: Record<Keys, CacheState>
): PropsFactory<{ requestsCache: Record<Keys, CacheState> }, EmptyConfig> {
  return {
    props: {
      requestsCache: initialValue ?? ({} as Record<Keys, CacheState>),
    },
    config: undefined,
  };
}
export function selectRequestCache<S extends RequestsCacheState>(
  key: CacheRecordKeys<S>
): OperatorFunction<S, CacheState> {
  return select((state) => getRequestCache(key)(state));
}

export function updateRequestCache<S extends RequestsCacheState>(
  key: CacheRecordKeys<S>,
  { ttl, value: v }: { ttl?: number; value?: CacheState['value'] } = {}
): Reducer<S> {
  const data = {
    value: v ?? 'full',
  } as CacheState;
  if (ttl) {
    data.timestamp = Date.now() + ttl;
  }

  return function (state) {
    return {
      ...state,
      requestsCache: {
        ...state.requestsCache,
        [key]: data,
      },
    };
  };
}

export function getRequestCache<S extends RequestsCacheState>(
  key: CacheRecordKeys<S>
): Query<S, CacheState> {
  return function (state: S) {
    const cacheValue =
      state.requestsCache[key] ??
      ({
        value: 'none',
      } as CacheState);

    if (cacheValue.timestamp && cacheValue.timestamp < Date.now()) {
      return {
        value: 'none',
      };
    }

    return cacheValue;
  };
}

export function selectIsRequestCached<S extends RequestsCacheState>(
  key: Parameters<typeof isRequestCached>[0],
  options?: { value?: CacheState['value'] }
): OperatorFunction<S, boolean> {
  return select((state) => isRequestCached(key, options)(state));
}

export function isRequestCached<S extends RequestsCacheState>(
  key: OrArray<CacheRecordKeys<S>>,
  options?: { value?: CacheState['value'] }
) {
  return function (state: S) {
    const type = options?.value ?? 'full';
    return coerceArray(key).some(
      (k) => getRequestCache(k)(state).value === type
    );
  };
}

export function skipWhileCached<S extends RequestsCacheState, T>(
  store: Store<StoreDef<S>>,
  key: OrArray<CacheRecordKeys<S>>,
  options?: { value?: CacheState['value']; returnSource?: Observable<any> }
) {
  return function (source: Observable<T>) {
    if (store.query(isRequestCached(key, { value: options?.value }))) {
      return options?.returnSource ?? EMPTY;
    }

    return source;
  };
}

export function createRequestsCacheOperator<S extends RequestsCacheState>(
  store: Store<StoreDef<S>>
) {
  return function <T>(
    key: CacheRecordKeys<S>,
    options?: Parameters<typeof skipWhileCached>[2]
  ) {
    return skipWhileCached<S, T>(store, key, options);
  };
}
