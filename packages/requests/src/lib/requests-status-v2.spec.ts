import {
  createState,
  PropsFactory,
  Query,
  Reducer,
  select,
  StateOf,
  Store,
  getStoreContext,
  StoreDef,
} from '@ngneat/elf';
import {
  defer,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  tap,
  timer,
} from 'rxjs';

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

export function withRequestsStatus<Keys extends string>({
  initialValue,
  defaultValue,
}: {
  initialValue?: Record<Keys, StatusState>;
  defaultValue?: 'idle' | 'pending';
} = {}): PropsFactory<
  { requestsStatus: Record<Keys, StatusState> },
  { defaultRequestValue: 'idle' | 'pending' }
> {
  return {
    props: {
      requestsStatus: initialValue ?? ({} as any),
    },
    config: {
      defaultRequestValue: defaultValue ?? 'idle',
    },
  };
}

export function updateRequestStatus<
  S extends StateOf<typeof withRequestsStatus>
>(
  key: S extends { requestsStatus: Record<infer K, any> } ? K : string,
  value: 'error',
  error: any
): Reducer<S>;

export function updateRequestStatus<
  S extends StateOf<typeof withRequestsStatus>
>(
  key: S extends { requestsStatus: Record<infer K, any> } ? K : string,
  value: Exclude<StatusState['value'], 'error'>,
  error?: any
): Reducer<S>;

export function updateRequestStatus<
  S extends StateOf<typeof withRequestsStatus>
>(key: any, value: any, error?: any): Reducer<S> {
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

export function getRequestStatus<S extends StateOf<typeof withRequestsStatus>>(
  key: S extends { requestsStatus: Record<infer K, any> } ? K : string
): Query<S, StatusState> {
  return function (state, context) {
    return (
      state.requestsStatus[key] ??
      ({
        value: context.config.defaultRequestValue,
      } as PendingState)
    );
  };
}

export function selectRequestStatus<
  S extends StateOf<typeof withRequestsStatus>
>(
  key: S extends { requestsStatus: Record<infer K, any> } ? K : string,
  options?: { groupKey?: string }
): OperatorFunction<S, StatusState> {
  return select((state) => {
    const context = getStoreContext(state);
    const base = getRequestStatus(key)(state, context);

    if (options?.groupKey) {
      const parent = getRequestStatus(options.groupKey)(state, context);
      return parent.value === 'success' ? parent : base;
    }

    return base;
  });
}

export function selectIsRequestPending<
  S extends StateOf<typeof withRequestsStatus>
>(
  key: S extends { requestsStatus: Record<infer K, any> } ? K : string
): OperatorFunction<S, boolean> {
  return select(
    (state) =>
      getRequestStatus(key)(state, getStoreContext(state)).value === 'pending'
  );
}

function trackRequestStatus<Keys extends string, T>(
  store: Store<StoreDef<StateOf<typeof withRequestsStatus>>>,
  key: Keys,
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

export function bindTrackRequestStatus<
  S extends StateOf<typeof withRequestsStatus>
>(store: Store<StoreDef<S>>) {
  return function <T>(
    key: S extends { requestsStatus: Record<infer K, any> } ? K : string,
    options?: Parameters<typeof trackRequestStatus>[2]
  ) {
    return trackRequestStatus<
      S extends { requestsStatus: Record<infer K, any> } ? K : string,
      T
    >(store as any, key, options);
  };
}

const { state, config } = createState(
  withRequestsStatus<'users' | `user-${string}`>({
    defaultValue: 'pending',
  })
);

const s = new Store({ state, config, name: '' });

const dd = bindTrackRequestStatus(s);

s.update(updateRequestStatus('users', 'idle'));

test('', () => {
  console.log(s.query(getRequestStatus('users')));

  s.pipe(selectRequestStatus('users')).subscribe((v) => {
    console.log(v);
  });

  s.pipe(selectIsRequestPending('users'));

  timer(1000).pipe(dd('users'));
});
