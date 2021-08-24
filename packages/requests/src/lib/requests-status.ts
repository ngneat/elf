import {
  propsFactory,
  Query,
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
} from 'rxjs';
import { tap } from 'rxjs/operators';

type StatusValue = Record<string | number, StatusState>;

export type StatusState = SuccessState | ErrorState | PendingState;

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

export const {
  withRequestsStatus,
  updateRequestsStatus,
  selectRequestsStatus,
  resetRequestsStatus,
  getRequestsStatus,
  setRequestsStatus,
} = propsFactory('requestsStatus', {
  initialValue: {} as StatusValue,
});

export function selectRequestStatus<
  S extends StateOf<typeof withRequestsStatus>
>(key: string | number): OperatorFunction<S, StatusState> {
  return select((state) => getRequestStatus(key)(state));
}

export function getRequestStatus<S extends StateOf<typeof withRequestsStatus>>(
  key: string | number
): Query<S, StatusState> {
  return function (state: S) {
    return (
      getRequestsStatus(state)[key] ??
      ({
        value: 'pending',
      } as PendingState)
    );
  };
}

export function selectIsRequestPending<
  S extends StateOf<typeof withRequestsStatus>
>(key: string | number): OperatorFunction<S, boolean> {
  return select((state) => getRequestStatus(key)(state).value === 'pending');
}

export function setRequestStatus<
  T,
  S extends StateOf<typeof withRequestsStatus>
>(
  store: Store<StoreDef<S>>,
  key: string,
  options?: { mapError?: (error: any) => any }
): MonoTypeOperatorFunction<T> {
  return function (source: Observable<T>) {
    return defer(() => {
      store.reduce(
        updateRequestsStatus({
          [key]: {
            value: 'pending',
          },
        })
      );

      return source.pipe(
        tap({
          next() {
            store.reduce(
              updateRequestsStatus({
                [key]: {
                  value: 'success',
                } as SuccessState,
              })
            );
          },
          error(error) {
            store.reduce(
              updateRequestsStatus({
                [key]: {
                  value: 'error',
                  error: options?.mapError ? options?.mapError(error) : error,
                } as ErrorState,
              })
            );
          },
        })
      );
    });
  };
}
