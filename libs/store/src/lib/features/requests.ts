import { propsFactory } from '../core/props-factory';
import { Query, StateOf } from '../core/types';
import {
  defer,
  EMPTY,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { Reducer, select, Store } from '../core';
import { StoreDef } from '../core/store';
import { tap } from 'rxjs/operators';

export type Requests = {
  cache: Record<string, CacheState>;
  status: Record<string, StatusState>;
};

export type StatusState = 'idle' | 'pending' | 'success' | 'error';
export type CacheState = 'partial' | 'full';

export const {
  withRequests,
  updateRequests,
  setRequests,
  resetRequests,
  getRequests,
  selectRequests,
} = propsFactory('requests', {
  initialValue: {
    cache: {},
    status: {},
  } as Requests,
});

export function selectRequestsCache<S extends StateOf<typeof withRequests>>(
  key: string
): OperatorFunction<S, CacheState>;
export function selectRequestsCache<
  S extends StateOf<typeof withRequests>
>(): OperatorFunction<S, S['requests']['cache']>;
export function selectRequestsCache<S extends StateOf<typeof withRequests>>(
  key?: string
): OperatorFunction<S, S['requests']['cache'] | CacheState> {
  return select((state) => {
    return key ? state.requests.cache[key] : state.requests.cache;
  });
}

export function selectRequestsStatus<S extends StateOf<typeof withRequests>>(
  key: string
): OperatorFunction<S, StatusState>;
export function selectRequestsStatus<
  S extends StateOf<typeof withRequests>
>(): OperatorFunction<S, S['requests']['status']>;
export function selectRequestsStatus<S extends StateOf<typeof withRequests>>(
  key?: string
): OperatorFunction<S, StatusState | S['requests']['status']> {
  return select((state) => {
    return key ? state.requests.status[key] : state.requests.status;
  });
}

export function getRequestsCache<S extends StateOf<typeof withRequests>>(
  key: string
): Query<S, CacheState>;
export function getRequestsCache<S extends StateOf<typeof withRequests>>(): Query<
  S,
  S['requests']['cache']
>;
export function getRequestsCache<S extends StateOf<typeof withRequests>>(
  key?: string
): Query<S, S['requests']['cache'] | CacheState> {
  return function (state: S) {
    return key ? state.requests.cache[key] : state.requests.cache;
  };
}

export function getRequestsStatus<S extends StateOf<typeof withRequests>>(
  key: string
): Query<S, StatusState>;
export function getRequestsStatus<S extends StateOf<typeof withRequests>>(): Query<
  S,
  S['requests']['status']
>;
export function getRequestsStatus<S extends StateOf<typeof withRequests>>(
  key?: string
): Query<S, S['requests']['status'] | StatusState> {
  return function (state: S) {
    return key ? state.requests.status[key] : state.requests.status;
  };
}

export function updateRequestsCache<S extends StateOf<typeof withRequests>>(
  key: string,
  value: CacheState = 'full'
): Reducer<S> {
  return updateRequests((state) => {
    if (state.requests.cache[key] === value) {
      return state.requests;
    }

    return {
      cache: {
        ...state.requests.cache,
        [key]: value,
      },
    };
  });
}

export function updateRequestsStatus<S extends StateOf<typeof withRequests>>(
  key: string,
  value: StatusState
): Reducer<S> {
  return updateRequests((state) => {
    if (state.requests.status[key] === value) {
      return state.requests;
    }

    return {
      status: {
        ...state.requests.status,
        [key]: value,
      },
    };
  });
}

export function inCache<S extends StateOf<typeof withRequests>>(
  key: string,
  value: CacheState = 'full'
) {
  return function (state: S) {
    return getRequestsCache(key)(state) === value;
  };
}

export function skipWhileCached<T, S extends StateOf<typeof withRequests>>(
  store: Store<StoreDef<S>>,
  key: string,
  options?: { type?: CacheState; returnSource?: Observable<any> }
) {
  return function (source: Observable<T>) {
    if (store.query(inCache(key, options?.type))) {
      return options?.returnSource ?? EMPTY;
    }

    return source;
  };
}

export function setRequestStatus<T, S extends StateOf<typeof withRequests>>(
  store: Store<StoreDef<S>>,
  key: string
): MonoTypeOperatorFunction<T> {
  return function (source: Observable<T>) {
    return defer(() => {
      store.reduce(updateRequestsStatus(key, 'pending'));

      return source.pipe(
        tap({
          next() {
            store.reduce(updateRequestsStatus(key, 'success'));
          },
          error() {
            store.reduce(updateRequestsStatus(key, 'error'));
          },
        })
      );
    });
  };
}
