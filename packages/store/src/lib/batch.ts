import {
  BehaviorSubject,
  Observable,
  firstValueFrom,
  isObservable,
} from 'rxjs';
import { filter, take } from 'rxjs/operators';

export let asyncBatchesInProgress = 0;

export const batchInProgress = new BehaviorSubject<boolean>(false);
export const batchDone$ = batchInProgress.asObservable().pipe(
  filter((inProgress) => !inProgress),
  take(1),
);

export function emitOnce<T>(cb: () => T) {
  if (!batchInProgress.getValue()) {
    batchInProgress.next(true);
    const value = cb();
    if (asyncBatchesInProgress === 0) {
      batchInProgress.next(false);
    }

    return value;
  }

  return cb();
}

export async function emitOnceAsync<T>(cb: () => Promise<T> | Observable<T>) {
  asyncBatchesInProgress++;
  if (!batchInProgress.getValue()) {
    batchInProgress.next(true);
  }

  const callbackReturnValue = cb();
  const value = await (isObservable(callbackReturnValue)
    ? firstValueFrom(callbackReturnValue)
    : callbackReturnValue);
  if (--asyncBatchesInProgress === 0) {
    batchInProgress.next(false);
  }

  return value;
}
