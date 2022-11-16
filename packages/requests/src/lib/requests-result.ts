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

export interface BaseRequestResult {
  staleTime?: number;
  successfulRequestsCount: number;
}

export interface LoadingRequestResult extends BaseRequestResult {
  isLoading: true;
  isSuccess: false;
  isError: false;
  status: 'loading';
}

export interface SuccessRequestResult extends BaseRequestResult {
  isLoading: false;
  isSuccess: true;
  isError: false;
  status: 'success';
}

export interface ErrorRequestResult<TError = any> extends BaseRequestResult {
  isLoading: false;
  isSuccess: false;
  isError: true;
  status: 'error';
  error: TError;
}

export interface IdleRequestResult extends BaseRequestResult {
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

function initialResult(): RequestResult {
  return {
    isError: false,
    isLoading: true,
    isSuccess: false,
    status: 'loading',
    successfulRequestsCount: 0,
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
  key: unknown[],
  { initialStatus }: { initialStatus?: 'idle' } = {}
): Observable<RequestResult<TError>> {
  let result = initialResult();

  if (initialStatus === 'idle') {
    result = {
      ...result,
      status: 'idle',
      isLoading: false,
    } as RequestResult<TError>;
  }

  return getSource<RequestResult>(key, result, emitters) as Observable<
    RequestResult<TError>
  >;
}

function updateRequestResult(key: unknown[], newValue: Partial<RequestResult>) {
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

    hasChange &&
      result.next({
        ...currentResult,
        ...newValue,
      } as RequestResult);
  }
}

// @public
export function clearRequestsResult() {
  emitters.clear();
  waiters.clear();
}

// @public
export function deleteRequestResult(key: unknown[]) {
  emitters.delete(resolveKey(key));
}

// @public
export function joinRequestResult<T, TError = any>(
  ...[key, options]: Parameters<typeof getRequestResult>
): OperatorFunction<T, RequestResult<TError> & { data: T }> {
  return function (source: Observable<T>) {
    const source$ = combineLatest([
      source,
      getRequestResult<TError>(key, options),
    ]).pipe(
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
        const stale = options?.staleTime
          ? result.staleTime! < Date.now()
          : false;

        if (!options?.skipCache && result.isSuccess && !stale) {
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
              const newResult: SuccessRequestResult = {
                isLoading: false,
                isSuccess: true,
                isError: false,
                status: 'success',
                successfulRequestsCount: result.successfulRequestsCount + 1,
              };

              if (options?.staleTime) {
                newResult.staleTime = Date.now() + options.staleTime;
              }

              updateRequestResult(key, newResult);
            },
          })
        );
      })
    );
  };
}
