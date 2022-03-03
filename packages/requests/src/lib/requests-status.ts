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
  pipe,
} from 'rxjs';
import { distinctUntilKeyChanged, tap } from 'rxjs/operators';

export type RequestsStatusState = StateOf<typeof withRequestsStatus>;
export type RecordKeys<S> = S extends { requestsStatus: Record<infer K, any> }
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

export function updateRequestsStatus<S extends RequestsStatusState>(
  keys: Array<RecordKeys<S>>,
  value: 'error',
  error: any
): Reducer<S>;
export function updateRequestsStatus<S extends RequestsStatusState>(
  keys: Array<RecordKeys<S>>,
  value: Exclude<StatusState['value'], 'error'>
): Reducer<S>;
export function updateRequestsStatus<S extends RequestsStatusState>(
  requests: Partial<Record<RecordKeys<S>, StatusState>>
): Reducer<S>;
export function updateRequestsStatus<S extends RequestsStatusState>(
  requestsOrKeys: any,
  value?: any,
  error?: any
): Reducer<S> {
  let normalized = requestsOrKeys;
  if (value) {
    normalized = requestsOrKeys.reduce((acc: any, key: string) => {
      acc[key] = resolveStatus(value, error);

      return acc;
    }, {});
  }

  return function (state) {
    return {
      ...state,
      requestsStatus: {
        ...state.requestsStatus,
        ...normalized,
      },
    };
  };
}

function resolveStatus(value: StatusState['value'], error?: any) {
  const newStatus = {
    value,
  } as StatusState;

  if (value === 'error') {
    (newStatus as ErrorState).error = error;
  }

  return newStatus;
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
  return function (state) {
    return {
      ...state,
      requestsStatus: {
        ...state.requestsStatus,
        [key]: resolveStatus(value, error),
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
        value: 'idle',
      } as IdleState)
    );
  };
}

export function selectRequestStatus<S extends RequestsStatusState>(
  key: RecordKeys<S>,
  options?: { groupKey?: string }
): OperatorFunction<S, StatusState> {
  return pipe(
    distinctUntilKeyChanged('requestsStatus'),
    select((state) => {
      const base = getRequestStatus(key)(state);

      if (options?.groupKey) {
        const parent = getRequestStatus(options.groupKey)(state);
        return parent.value === 'success' ? parent : base;
      }

      return base;
    })
  );
}

export function selectIsRequestPending<S extends RequestsStatusState>(
  key: RecordKeys<S>
): OperatorFunction<S, boolean> {
  return pipe(
    distinctUntilKeyChanged('requestsStatus'),
    select((state) => getRequestStatus(key)(state).value === 'pending')
  );
}

export function trackRequestStatus<S extends RequestsStatusState, T>(
  store: Store<StoreDef<S>>,
  key: RecordKeys<S>,
  options?: { mapError?: (error: any) => any }
): MonoTypeOperatorFunction<T> {
  return function (source: Observable<T>) {
    return defer(() => {
      if (store.query(getRequestStatus(key)).value !== 'pending') {
        store.update(updateRequestStatus(key, 'pending'));
      }

      return source.pipe(
        tap({
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

export function createRequestsStatusOperator<S extends RequestsStatusState>(
  store: Store<StoreDef<S>>
) {
  return function <T>(
    key: RecordKeys<S>,
    options?: Parameters<typeof trackRequestStatus>[2]
  ) {
    return trackRequestStatus<S, T>(store, key, options);
  };
}

export function initializeAsPending<T extends string>(keys: OrArray<T>) {
  return coerceArray(keys).reduce((acc, key) => {
    acc[key] = {
      value: 'pending',
    };

    return acc;
  }, {} as Record<string, PendingState>);
}

export function clearRequestsStatus<
  S extends RequestsStatusState
>(): Reducer<S> {
  return function (state) {
    return {
      ...state,
      requestsStatus: {},
    };
  };
}
