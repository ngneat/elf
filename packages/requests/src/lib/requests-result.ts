import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  map,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  switchMap,
  take,
  tap,
} from 'rxjs';

// TODO - Make stricter type using overloads. For example, if `status` is loading `data` is undefined
interface Result<TData = unknown> {
  // The query has no data yet
  isLoading: boolean;
  // The request was successful and data is available
  isSuccess: boolean;
  // The request encountered an error
  isError: boolean;
  // The status gives information about the data: Do we have any or not?
  status: 'idle' | 'loading' | 'error' | 'success';
  data: TData;
  error: any;
}

export function initialResult(): Result {
  return {
    isError: false,
    isLoading: true,
    isSuccess: false,
    data: undefined,
    status: 'loading',
    error: undefined,
  };
}

function getSource<TValue>(
  key: unknown[],
  initialValue: TValue,
  map: Map<string, BehaviorSubject<TValue>>
) {
  const item = map.get(resolveKey(key));

  if (item) {
    return item.asObservable();
  }

  const newSource = new BehaviorSubject(initialValue);
  map.set(resolveKey(key), newSource);

  return newSource.asObservable();
}

const waiters = new Map<string, BehaviorSubject<boolean>>();

function getWaiter(key: unknown[]): Observable<boolean> {
  return getSource(key, false, waiters);
}

function setWait(key: unknown[], wait = true) {
  waiters.get(resolveKey(key))?.next(wait);
}

function resolveKey(key: unknown): string {
  return JSON.stringify(key);
}

const emitters = new Map<string, BehaviorSubject<Result>>();

// @public
export function getRequestResult<TData>(
  key: unknown[]
): Observable<Result<TData>> {
  return getSource<Result>(key, initialResult(), emitters) as Observable<
    Result<TData>
  >;
}

function updateRequestResult(key: unknown[], newValue: Partial<Result>) {
  const result = emitters.get(resolveKey(key));

  if (result) {
    let hasChange = false;

    const currentResult = result.getValue();

    for (const key of Object.keys(newValue)) {
      if (
        currentResult[key as keyof Result] !== newValue[key as keyof Result]
      ) {
        hasChange = true;
        break;
      }
    }

    hasChange &&
      result.next({
        ...currentResult,
        ...newValue,
      });
  }
}

// @public
export function deleteRequestResult(key: unknown[]) {
  emitters.delete(resolveKey(key));
}

// @public
export function joinRequestResult<T>(
  key: unknown[]
): OperatorFunction<T, Result<T>> {
  return function (source: Observable<T>) {
    const source$ = combineLatest([source, getRequestResult(key)]).pipe(
      map(([data, result]) => {
        return {
          ...result,
          data,
        };
      })
    );

    return getWaiter(key).pipe(
      switchMap((shouldWait) => {
        if (shouldWait) return EMPTY;

        return source$;
      })
    );
  };
}

// TODO
interface Options<TData> {
  // When we should refetch
  staleTime?: number;
  // Auto refetch based on the provided time
  refetchTime?: number;
  // Ignore everything and perform the request
  skipCache?: boolean;
  isSuccessPredicateFn?: (data: TData) => boolean;
}

export function trackRequestResult<TData>(
  key: unknown[],
  options?: Options<TData>
): MonoTypeOperatorFunction<TData> {
  return function (source: Observable<TData>) {
    return getRequestResult(key).pipe(
      take(1),
      switchMap((result) => {
        if (result.isSuccess) {
          return EMPTY;
        }

        updateRequestResult(key, { isLoading: true });

        setWait(key, true);

        return source.pipe(
          tap({
            finalize() {
              setWait(key, false);
            },
            error(error) {
              updateRequestResult(key, {
                isError: true,
                isLoading: false,
                status: 'idle',
                error,
              });
            },
            complete() {
              updateRequestResult(key, {
                isLoading: false,
                isSuccess: true,
                status: 'idle',
              });
            },
          })
        );
      })
    );
  };
}
