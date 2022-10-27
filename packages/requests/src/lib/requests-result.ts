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
}

export function initialResult(): Result {
  return {
    isError: false,
    isLoading: true,
    isSuccess: false,
    data: undefined,
    status: 'loading',
  };
}

const waiters = new Map<string, BehaviorSubject<boolean>>();

function getWaiter(key: unknown[]): Observable<boolean> {
  const waiter = waiters.get(JSON.stringify(key));

  if (waiter) {
    return waiter.asObservable();
  }

  const newWaiter = new BehaviorSubject(false);
  waiters.set(JSON.stringify(key), newWaiter);

  return newWaiter.asObservable();
}

function setWait(key: unknown[], wait = true) {
  waiters.get(JSON.stringify(key))?.next(wait);
}

const emitters = new Map<string, BehaviorSubject<Result>>();

// @public
export function getRequestResult<TData>(
  key: unknown[]
): Observable<Result<TData>> {
  const result = emitters.get(JSON.stringify(key));

  if (result) {
    return result.asObservable() as Observable<Result<TData>>;
  }

  const newResult = new BehaviorSubject(initialResult());
  emitters.set(JSON.stringify(key), newResult);

  return newResult.asObservable() as Observable<Result<TData>>;
}

function updateRequestResult(key: unknown[], newValue: Partial<Result>) {
  const result = emitters.get(JSON.stringify(key));

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
            error() {
              updateRequestResult(key, {
                isError: true,
                isLoading: false,
                status: 'idle',
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
