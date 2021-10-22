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
import {
  defer,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  tap,
} from 'rxjs';

type RequestsStatusState = StateOf<typeof withRequestsStatus>;
type RecordKeys<S> = S extends { requestsStatus: Record<infer K, any> }
  ? K
  : string;

export type StatusState = SuccessState | ErrorState | PendingState | IdleState;

export interface SuccessState {
  value: 'success';
}

export interface ErrorState {
  value: 'error';
  error: unknown;
}

export interface PendingState {
  value: 'pending';
}

export interface IdleState {
  value: 'idle';
}

export function withRequestsStatus<Keys extends string>(
  initialValue?: Record<Keys, StatusState>
): PropsFactory<{ requestsStatus: Record<Keys, StatusState> }, EmptyConfig> {
  return {
    props: {
      requestsStatus: initialValue ?? ({} as Record<Keys, StatusState>),
    },
    config: undefined,
  };
}

export function updateRequestStatus<S extends RequestsStatusState>(
  key: RecordKeys<S>,
  value: 'error',
  error: any
): Reducer<S>;

export function updateRequestStatus<S extends RequestsStatusState>(
  key: RecordKeys<S>,
  value: Exclude<StatusState['value'], 'error'>,
  error?: any
): Reducer<S>;

export function updateRequestStatus<S extends RequestsStatusState>(
  key: any,
  value: any,
  error?: any
): Reducer<S> {
  const newStatus = {
    value,
  } as StatusState;

  if (value === 'error') {
    (newStatus as ErrorState).error = error;
  }

  return function (state) {
    return {
      ...state,
      requestsStatus: {
        ...state.requestsStatus,
        [key]: newStatus,
      },
    };
  };
}

export function getRequestStatus<S extends RequestsStatusState>(
  key: RecordKeys<S>
): Query<S, StatusState> {
  return function (state) {
    return (
      state.requestsStatus[key] ??
      ({
        value: 'pending',
      } as PendingState)
    );
  };
}

export function selectRequestStatus<S extends RequestsStatusState>(
  key: RecordKeys<S>,
  options?: { groupKey?: string }
): OperatorFunction<S, StatusState> {
  return select((state) => {
    const base = getRequestStatus(key)(state);

    if (options?.groupKey) {
      const parent = getRequestStatus(options.groupKey)(state);
      return parent.value === 'success' ? parent : base;
    }

    return base;
  });
}

export function selectIsRequestPending<S extends RequestsStatusState>(
  key: RecordKeys<S>
): OperatorFunction<S, boolean> {
  return select((state) => getRequestStatus(key)(state).value === 'pending');
}

function trackRequestStatus<S extends RequestsStatusState, T>(
  store: Store<StoreDef<S>>,
  key: RecordKeys<S>,
  options?: { mapError?: (error: any) => any; handleSuccess?: boolean }
): MonoTypeOperatorFunction<T> {
  return function (source: Observable<T>) {
    return defer(() => {
      if (store.query(getRequestStatus(key)).value !== 'pending') {
        store.update(updateRequestStatus(key, 'pending'));
      }

      return source.pipe(
        tap({
          next() {
            if (options?.handleSuccess) {
              store.update(updateRequestStatus(key, 'success'));
            }
          },
          error(error) {
            store.update(
              updateRequestStatus(
                key,
                'error',
                options?.mapError ? options?.mapError(error) : error
              )
            );
          },
        })
      );
    });
  };
}

export function createRequestStatusOperator<S extends RequestsStatusState>(
  store: Store<StoreDef<S>>
) {
  return function <T>(
    key: RecordKeys<S>,
    options?: Parameters<typeof trackRequestStatus>[2]
  ) {
    return trackRequestStatus<S, T>(store, key, options);
  };
}

export function initializeAsIdle(keys: OrArray<string>) {
  return coerceArray(keys).reduce((acc, key) => {
    acc[key] = {
      value: 'idle',
    };

    return acc;
  }, {} as Record<string, IdleState>);
}
