import { combineLatest, map, Observable } from 'rxjs';
import { StatusState } from '..';

export function createRequestDataSource<
  Data,
  DataKey extends string = 'data',
  Error = unknown
>({
  data$,
  status$,
  dataKey,
}: {
  dataKey?: DataKey;
  data$: Observable<Data>;
  status$: Observable<StatusState>;
}): Observable<{
  [K in 'loading' | 'error' | DataKey]: K extends DataKey
    ? Data
    : K extends 'loading'
    ? boolean
    : K extends 'error'
    ? Error
    : never;
}> {
  return combineLatest({
    data: data$,
    status: status$,
  }).pipe(
    map(({ data, status }) => {
      return {
        [dataKey ?? 'data']: data,
        loading: status.value === 'pending',
        error: status.value === 'error' ? status.error : undefined,
      } as any;
    })
  );
}
