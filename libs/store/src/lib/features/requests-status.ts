import { propsFactory, select, Store } from '../core';
import { Query, StateOf } from '../core/types';
import {
  defer,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
} from 'rxjs';
import { StoreDef } from '../core/store';
import { tap } from 'rxjs/operators';

type StatusValue = Record<string | number, StatusState>;
export type StatusState = 'pending' | 'success' | 'error';

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
    return getRequestsStatus(state)[key] ?? ('pending' as StatusState);
  };
}

export function selectIsRequestPending<
  S extends StateOf<typeof withRequestsStatus>
>(key: string | number): OperatorFunction<S, boolean> {
  return select((state) => getRequestStatus(key)(state) === 'pending');
}

export function setRequestStatus<
  T,
  S extends StateOf<typeof withRequestsStatus>
>(store: Store<StoreDef<S>>, key: string): MonoTypeOperatorFunction<T> {
  return function (source: Observable<T>) {
    return defer(() => {
      store.reduce(updateRequestsStatus({ [key]: 'pending' }));

      return source.pipe(
        tap({
          next() {
            store.reduce(updateRequestsStatus({ [key]: 'success' }));
          },
          error() {
            store.reduce(updateRequestsStatus({ [key]: 'error' }));
          },
        })
      );
    });
  };
}
