import { propsFactory, select, Store } from '@ngneat/elf';
import { Query, StateOf } from '../core/types';
import { EMPTY, Observable, OperatorFunction } from 'rxjs';
import { coerceArray } from '../core/utils';
import { StoreDef } from '../core/store';

type CacheValue = Record<string | number, CacheState>;
export type CacheState = 'none' | 'partial' | 'full';

export const {
  withRequestsCache,
  updateRequestsCache,
  selectRequestsCache,
  resetRequestsCache,
  getRequestsCache,
  setRequestsCache,
} = propsFactory('requestsCache', {
  initialValue: {} as CacheValue,
});

export function selectRequestCache<S extends StateOf<typeof withRequestsCache>>(
  key: string | number
): OperatorFunction<S, CacheState> {
  return select((state) => getRequestCache(key)(state));
}

export function getRequestCache<S extends StateOf<typeof withRequestsCache>>(
  key: string | number
): Query<S, CacheState> {
  return function (state: S) {
    return getRequestsCache(state)[key] ?? ('none' as CacheState);
  };
}

export function selectIsRequestCached<
  S extends StateOf<typeof withRequestsCache>
>(
  key: string | number | string[] | number[],
  options?: { type?: CacheState }
): OperatorFunction<S, boolean> {
  return select((state) => isRequestCached(key, options)(state));
}

export function isRequestCached<S extends StateOf<typeof withRequestsCache>>(
  key: string | number | string[] | number[],
  options?: { type?: CacheState }
) {
  return function (state: S) {
    const type = options?.type ?? 'full';
    return coerceArray(key).some((k) => getRequestCache(k)(state) === type);
  };
}

export function skipWhileCached<T, S extends StateOf<typeof withRequestsCache>>(
  store: Store<StoreDef<S>>,
  key: string | number | string[] | number[],
  options?: { type?: CacheState; returnSource?: Observable<any> }
) {
  return function (source: Observable<T>) {
    if (store.query(isRequestCached(key, { type: options?.type }))) {
      return options?.returnSource ?? EMPTY;
    }

    return source;
  };
}
