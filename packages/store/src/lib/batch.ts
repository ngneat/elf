import { BehaviorSubject, filter, take } from 'rxjs';

export const batchInProgress = new BehaviorSubject<boolean>(false);
export const batchDone$ = batchInProgress.asObservable().pipe(
  filter((inProgress) => !inProgress),
  take(1)
);

export function emitOnce(cb: VoidFunction) {
  batchInProgress.next(true);
  cb();
  batchInProgress.next(false);
}
