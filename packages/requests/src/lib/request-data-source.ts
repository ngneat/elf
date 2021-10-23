import { Reducer, Store, StoreDef } from '@ngneat/elf';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  RecordKeys,
  RequestsStatusState,
  selectRequestStatus,
  skipWhileCached,
  StatusState,
  trackRequestStatus,
  updateRequestCache,
  updateRequestStatus,
} from '..';

export function createRequestDataSource<
  Data,
  DataKey extends string = 'data',
  Error = unknown
>({
  data$,
  store,
  status$,
  dataKey,
}: {
  dataKey?: DataKey;
  data$: Observable<Data>;
  status$: Observable<StatusState>;
  store: Store;
}): Observable<{
  [K in 'loading' | 'error' | DataKey]: K extends DataKey
    ? Data
    : K extends 'loading'
    ? boolean
    : K extends 'error'
    ? Error
    : never;
}> {
  return store
    .combine({
      data: data$,
      status: status$,
    })
    .pipe(
      map(({ data, status }) => {
        return {
          [dataKey ?? 'data']: data,
          loading: status.value === 'pending',
          error: status.value === 'error' ? status.error : undefined,
        } as any;
      })
    );
}

export function createRequestDataSource2<
  Data,
  S extends RequestsStatusState,
  RequestKey extends RecordKeys<S>,
  DataKey extends string,
  Error = unknown
>({
  data$,
  store,
  requestKey,
  dataKey,
}: {
  dataKey?: DataKey;
  data$: Observable<Data>;
  requestKey: RequestKey;
  store: Store<StoreDef<S>>;
}): {
  trackRequestStatus: <T>() => MonoTypeOperatorFunction<T>;
  skipWhileCached: <T>() => MonoTypeOperatorFunction<T>;
  setSuccess(): Reducer<S>;
  setCached(): Reducer<S>;
  data$: Observable<{
    [K in 'loading' | 'error' | DataKey]: K extends DataKey
      ? Data
      : K extends 'loading'
      ? boolean
      : K extends 'error'
      ? Error
      : never;
  }>;
} {
  return {
    trackRequestStatus: () => trackRequestStatus(store, requestKey) as any,
    skipWhileCached: () => skipWhileCached(store as any, requestKey),
    setSuccess() {
      return updateRequestStatus(requestKey, 'success');
    },
    setCached() {
      return updateRequestCache(requestKey, { value: 'full' }) as any;
    },
    data$: store
      .combine({
        data: data$,
        status: store.pipe(selectRequestStatus(requestKey)),
      })
      .pipe(
        map(({ data, status }) => {
          return {
            [dataKey as string]: data,
            loading: status.value === 'pending',
            error: status.value === 'error' ? status.error : undefined,
          } as any;
        })
      ),
  };
}

export function createRequestCollectionDataSource<
  Data,
  S extends RequestsStatusState,
  DataKey extends string,
  Error = unknown
>({
  data$,
  store,
  dataKey,
}: {
  dataKey: DataKey;
  data$: (id: any) => Observable<Data>;
  store: Store<StoreDef<S>>;
}): {
  trackRequestStatus: <T>(key: any) => MonoTypeOperatorFunction<T>;
  skipWhileCached: <T>(key: any) => MonoTypeOperatorFunction<T>;
  setSuccess(key: any): Reducer<S>;
  setCached(key: any): Reducer<S>;
  data$: (key: any) => Observable<{
    [K in 'loading' | 'error' | DataKey]: K extends DataKey
      ? Data
      : K extends 'loading'
      ? boolean
      : K extends 'error'
      ? Error
      : never;
  }>;
} {
  return {
    trackRequestStatus: (id: any) =>
      trackRequestStatus(store, `${dataKey}-${id}` as any) as any,
    skipWhileCached: (id: any) =>
      skipWhileCached(store as any, `${dataKey}-${id}` as any) as any,
    setSuccess(id: any) {
      return updateRequestStatus(`${dataKey}-${id}` as any, 'success');
    },
    setCached(id: any) {
      return updateRequestCache(`${dataKey}-${id}` as any, {
        value: 'full',
      }) as any;
    },
    data$: (id: string) =>
      store
        .combine({
          data: data$(id),
          status: store.pipe(selectRequestStatus(`${dataKey}-${id}` as any)),
        })
        .pipe(
          map(({ data, status }) => {
            return {
              [dataKey]: data,
              loading: status.value === 'pending',
              error: status.value === 'error' ? status.error : undefined,
            } as any;
          })
        ),
  };
}
