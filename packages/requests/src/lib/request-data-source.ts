import { Store } from '@ngneat/elf';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ErrorState, StatusState } from '..';

export function createRequestDataSource<
  Data,
  DataKey extends string = 'data',
  Error = unknown
>({
  data$,
  store,
  status$,
  dataKey,
  idleAsPending = false,
}: {
  dataKey?: DataKey;
  data$: Observable<Data>;
  status$: Observable<StatusState>;
  store: Store;
  idleAsPending?: boolean;
}): Observable<{
  [K in 'loading' | 'error' | DataKey]: K extends DataKey
    ? Data
    : K extends 'loading'
    ? boolean
    : K extends 'error'
    ? Error
    : never;
}> {
  return store
    .combine({
      data: data$,
      status: status$,
    })
    .pipe(
      map(({ data, status }) => {
        const v = status.value;

        return {
          [dataKey ?? 'data']: data,
          loading: idleAsPending
            ? v === 'pending' || v === 'idle'
            : v === 'pending',
          error: v === 'error' ? (status as ErrorState).error : undefined,
        } as any;
      })
    );
}
