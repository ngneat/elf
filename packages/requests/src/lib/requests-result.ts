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

export interface LoadingRequestResult {
  isLoading: true;
  isSuccess: false;
  isError: false;
  status: 'loading';
}

export interface SuccessRequestResult {
  isLoading: false;
  isSuccess: true;
  isError: false;
  status: 'success';
}

export interface ErrorRequestResult<TError = any> {
  isLoading: false;
  isSuccess: false;
  isError: true;
  status: 'error';
  error: TError;
}

export interface IdleRequestResult {
  isLoading: false;
  isSuccess: false;
  isError: false;
  status: 'idle';
}

export type RequestResult<TError = any> =
  | LoadingRequestResult
  | SuccessRequestResult
  | ErrorRequestResult<TError>
  | IdleRequestResult;

export function initialResult(): RequestResult {
  return {
    isError: false,
    isLoading: true,
    isSuccess: false,
    status: 'loading',
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

const emitters = new Map<string, BehaviorSubject<RequestResult>>();

// @public
export function getRequestResult<TError>(
  key: unknown[]
): Observable<RequestResult<TError>> {
  return getSource<RequestResult>(key, initialResult(), emitters) as Observable<
    RequestResult<TError>
  >;
}

function updateRequestResult(key: unknown[], newValue: RequestResult) {
  const result = emitters.get(resolveKey(key));

  if (result) {
    let hasChange = false;

    const currentResult = result.getValue();

    for (const key of Object.keys(newValue)) {
      if (
        currentResult[key as keyof RequestResult] !==
        newValue[key as keyof RequestResult]
      ) {
        hasChange = true;
        break;
      }
    }

    hasChange && result.next(newValue);
  }
}

// @public
export function deleteRequestResult(key: unknown[]) {
  emitters.delete(resolveKey(key));
}

// @public
export function joinRequestResult<T, TError = any>(
  key: unknown[]
): OperatorFunction<T, RequestResult<TError> & { data: T }> {
  return function (source: Observable<T>) {
    const source$ = combineLatest([source, getRequestResult<TError>(key)]).pipe(
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
interface Options {
  // When we should refetch
  staleTime?: number;
  // Ignore everything and perform the request
  skipCache?: boolean;
}

export function trackRequestResult<TData>(
  key: unknown[],
  options?: Options
): MonoTypeOperatorFunction<TData> {
  return function (source: Observable<TData>) {
    return getRequestResult(key).pipe(
      take(1),
      switchMap((result) => {
        if (result.isSuccess && !options?.skipCache) {
          return EMPTY;
        }

        updateRequestResult(key, {
          isLoading: true,
          isError: false,
          isSuccess: false,
          status: 'loading',
        });

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
                isSuccess: false,
                status: 'error',
                error,
              });
            },
            complete() {
              updateRequestResult(key, {
                isLoading: false,
                isSuccess: true,
                isError: false,
                status: 'success',
              });
            },
          })
        );
      })
    );
  };
}
