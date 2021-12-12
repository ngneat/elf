import { Reducer, Store, StoreDef } from '@ngneat/elf';
import { MonoTypeOperatorFunction, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  RequestsCacheState,
  skipWhileCached,
  updateRequestCache,
} from './requests-cache';
import {
  RecordKeys,
  RequestsStatusState,
  selectRequestStatus,
  trackRequestStatus,
  updateRequestStatus,
} from './requests-status';

type KeyProp = { key: any };

type ReturnedData<DataKey extends string, Data, Error> = {
  [K in 'loading' | 'error' | DataKey]: K extends DataKey
    ? Data
    : K extends 'loading'
    ? boolean
    : K extends 'error'
    ? Error
    : never;
};

export type DataSource<S, DataKey extends string, Data, Error> = {
  trackRequestStatus: <T>(
    options?: Parameters<typeof trackRequestStatus>[2]
  ) => MonoTypeOperatorFunction<T>;
  setSuccess(): Reducer<S>;
  data$: () => Observable<ReturnedData<DataKey, Data, Error>>;
} & (S extends RequestsCacheState
  ? {
      skipWhileCached: <T>(
        options?: Parameters<typeof skipWhileCached>[2]
      ) => MonoTypeOperatorFunction<T>;
      setCached(options?: Parameters<typeof updateRequestCache>[1]): Reducer<S>;
    }
  : Record<any, any>);

export type DynamicKeyDataSource<S, DataKey extends string, Data, Error> = {
  trackRequestStatus: <T>(
    options: KeyProp & Parameters<typeof trackRequestStatus>[2]
  ) => MonoTypeOperatorFunction<T>;
  setSuccess(options: KeyProp): Reducer<S>;
  data$: (options: KeyProp) => Observable<ReturnedData<DataKey, Data, Error>>;
} & (S extends RequestsCacheState
  ? {
      skipWhileCached: <T>(
        options: KeyProp & Parameters<typeof skipWhileCached>[2]
      ) => MonoTypeOperatorFunction<T>;
      setCached(
        options: KeyProp & Parameters<typeof updateRequestCache>[1]
      ): Reducer<S>;
    }
  : Record<any, any>);

interface DataSourceCreationDefaultParams<
  S extends RequestsStatusState,
  DataKey extends string
> {
  store: Store<StoreDef<S>>;
  dataKey: DataKey;
  idleAsPending?: boolean;
  requestStatusOptions?: Parameters<typeof selectRequestStatus>[1];
}

interface DataSourceCreationParams<
  Data,
  S extends RequestsStatusState,
  RequestKey extends RecordKeys<S>,
  DataKey extends string
> extends DataSourceCreationDefaultParams<S, DataKey> {
  data$: () => Observable<Data>;
  requestKey: RequestKey;
}

interface DynamicKeyDataSourceCreationParams<
  Data,
  S extends RequestsStatusState,
  DataKey extends string
> extends DataSourceCreationDefaultParams<S, DataKey> {
  data$: (key: any) => Observable<Data>;
}

export function createRequestDataSource<
  Data,
  S extends RequestsStatusState,
  RequestKey extends RecordKeys<S>,
  DataKey extends string,
  Error = unknown
>(
  params: DataSourceCreationParams<Data, S, RequestKey, DataKey>
): DataSource<S, DataKey, Data, Error>;
export function createRequestDataSource<
  Data,
  S extends RequestsStatusState,
  DataKey extends string,
  Error = unknown
>(
  params: DynamicKeyDataSourceCreationParams<Data, S, DataKey>
): DynamicKeyDataSource<S, DataKey, Data, Error>;
export function createRequestDataSource<
  Data,
  S extends RequestsStatusState,
  RequestKey extends RecordKeys<S>,
  DataKey extends string,
  Error = unknown
>(
  params:
    | DataSourceCreationParams<Data, S, RequestKey, DataKey>
    | DynamicKeyDataSourceCreationParams<Data, S, DataKey>
):
  | DynamicKeyDataSource<S, DataKey, Data, Error>
  | DataSource<S, DataKey, Data, Error> {
  const {
    data$,
    store,
    dataKey,
    requestStatusOptions,
    requestKey,
    idleAsPending = false,
  } = Reflect.has(params, 'requestKey')
    ? (params as DataSourceCreationParams<Data, S, RequestKey, DataKey>)
    : { ...params, requestKey: undefined };

  return {
    trackRequestStatus: (
      options: KeyProp & Parameters<typeof trackRequestStatus>[2]
    ) => trackRequestStatus(store, requestKey ?? options?.key, options),
    skipWhileCached: (
      options: KeyProp & Parameters<typeof skipWhileCached>[2]
    ) => skipWhileCached(store as any, requestKey ?? options?.key, options),
    setSuccess(options: KeyProp) {
      return updateRequestStatus(requestKey ?? options?.key, 'success');
    },
    setCached(options: KeyProp & Parameters<typeof updateRequestCache>[1]) {
      return updateRequestCache(requestKey ?? options?.key, options) as any;
    },
    data$: (options: KeyProp) =>
      store
        .combine({
          data: data$(requestKey ?? options?.key),
          status: store.pipe(
            selectRequestStatus(
              requestKey ?? options?.key,
              requestStatusOptions || {}
            )
          ),
        })
        .pipe(
          map(({ data, status }) => {
            return {
              [dataKey as string]: data,
              loading: idleAsPending
                ? status.value === 'pending' || status.value === 'idle'
                : status.value === 'pending',
              error: status.value === 'error' ? status.error : undefined,
            } as any;
          }),
          distinctUntilChanged((a, b) => {
            // if the status is the same, for example, `pending` and `pending`, and the `data` is the same
            // don't emit a redundant value
            return (
              a[dataKey] === b[dataKey] &&
              a.loading === b.loading &&
              a.error === b.error
            );
          })
        ),
  } as any;
}
