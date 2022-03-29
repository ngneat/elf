import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

export const batchInProgress = new BehaviorSubject<boolean>(false);
export const batchDone$ = batchInProgress.asObservable().pipe(
  filter((inProgress) => !inProgress),
  take(1)
);

export function emitOnce<T>(cb: () => T) {
  batchInProgress.next(true);
  const value = cb();
  batchInProgress.next(false);

  return value;
}
