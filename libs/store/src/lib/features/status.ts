import {propsFactory} from '../core/props-factory';
import {StateOf} from "../core/types";
import {Store} from "../core";
import {StoreDef} from "../core/store";
import {defer, MonoTypeOperatorFunction, Observable} from "rxjs";
import {tap} from "rxjs/operators";

export type StatusState = 'idle' | 'pending' | 'success' | 'error';

type State = { type: StatusState, requestCount: number, error: any }

export const {withStatus, setStatus, selectStatus, updateStatus, resetStatus, getStatus} =
  propsFactory<{ status: State }>('status', {
    type: 'idle',
    error: null,
    requestCount: 0
  });


export function setRequestStatus<T, S extends StateOf<typeof withStatus>>(store: Store<StoreDef<S>>): MonoTypeOperatorFunction<T> {
  return function (source: Observable<T>) {
    return defer(() => {
      store.reduce(setStatus(state => ({
        type: 'pending',
        requestCount: state.status.requestCount + 1,
        error: null
      })));

      return source.pipe(tap({
        next() {
          store.reduce(updateStatus({ type: 'success' }))
        },
        error(e) {
          store.reduce(updateStatus({ type: 'error', error: e }))
        }
      }))
    })
  }
}

