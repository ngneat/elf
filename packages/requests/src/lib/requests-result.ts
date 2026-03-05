import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter,
  map,
  MonoTypeOperatorFunction,
  Observable,
  of,
  OperatorFunction,
  pipe,
  switchMap,
  take,
  tap,
  throwError,
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
  fetchStatus: 'fetching' | 'idle';
}

export interface SuccessRequestResult<TData = any> extends BaseRequestResult {
  isLoading: false;
  isSuccess: true;
  isError: false;
  status: 'success';
  fetchStatus: 'idle';
  responseData?: TData;
  dataUpdatedAt?: number;
}

export interface ErrorRequestResult<TError = any> extends BaseRequestResult {
  isLoading: false;
  isSuccess: false;
  isError: true;
  status: 'error';
  fetchStatus: 'idle';
  error: TError;
  errorUpdatedAt?: number;
}

export interface IdleRequestResult extends BaseRequestResult {
  isLoading: false;
  isSuccess: false;
  isError: false;
  status: 'idle';
  fetchStatus: 'idle';
}

export type RequestResult<TError = any, TData = any> =
  | LoadingRequestResult
  | SuccessRequestResult<TData>
  | ErrorRequestResult<TError>
  | IdleRequestResult;

function initialResult(): RequestResult {
  return {
    isError: false,
    isLoading: true,
    isSuccess: false,
    status: 'loading',
    fetchStatus: 'idle',
    successfulRequestsCount: 0,
  };
}

function getSource<TValue>(
  key: unknown[],
  initialValue: TValue,
  map: Map<string, BehaviorSubject<TValue>>,
) {
  const item = map.get(resolveKey(key));

  if (item) {
    return item.asObservable();
  }

  const newSource = new BehaviorSubject(initialValue);
  map.set(resolveKey(key), newSource);

  return newSource.asObservable();
}

function resolveKey(key: unknown): string {
  return JSON.stringify(key);
}

const emitters = new Map<string, BehaviorSubject<RequestResult>>();

// @public
export function getRequestResult<TError>(
  key: unknown[],
  { initialStatus }: { initialStatus?: 'idle' } = {},
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

    if (hasChange) {
      result.next({
        ...currentResult,
        ...newValue,
      } as RequestResult);
    }
  }
}

// @public
export function clearRequestsResult() {
  emitters.clear();
}

// @public
export function deleteRequestResult(key: unknown[]) {
  emitters.delete(resolveKey(key));
}

// @public
export function resetStaleTime(key: unknown[]) {
  updateRequestResult(key, {
    staleTime: undefined,
  });
}

// @public
export function joinRequestResult<T, TError = any, TData = any>(
  ...[key, options]: Parameters<typeof getRequestResult>
): OperatorFunction<T, RequestResult<TError, TData> & { data: T }> {
  return function (source: Observable<T>) {
    return combineLatest([source, getRequestResult<TError>(key, options)]).pipe(
      map(([data, result]) => {
        return {
          ...result,
          data,
        };
      }),
    );
  };
}

interface Options<TData> {
  // When we should refetch
  staleTime?: number;
  // Ignore everything and perform the request
  skipCache?: boolean;
  // Skip the request if it's already fetching
  preventConcurrentRequest?: boolean;
  // Wheteher to cache the response data
  cacheResponseData?: boolean;
  // Whether to cache request result for any additional keys
  additionalKeys?: (_: TData) => unknown[][];
}

export function trackRequestResult<TData>(
  key: unknown[],
  options?: Options<TData>,
): MonoTypeOperatorFunction<TData> {
  return function (source: Observable<TData>) {
    return getRequestResult(key).pipe(
      take(1),
      switchMap((result) => {
        const stale = options?.staleTime
          ? (result.staleTime ?? 0) < Date.now()
          : false;

        const preventConcurrentRequest =
          options?.preventConcurrentRequest !== undefined
            ? options.preventConcurrentRequest
            : true;

        const cacheResponseData = options?.cacheResponseData;

        if (result.isSuccess && !options?.skipCache && !stale) {
          return of(result.responseData);
        }

        if (
          result.fetchStatus === 'fetching' &&
          preventConcurrentRequest &&
          !options?.skipCache
        ) {
          return getRequestResult(key).pipe(
            filter((requestResult) => requestResult.fetchStatus === 'idle'),
            switchMap((requestResult) => {
              if (requestResult.isError) {
                return throwError(() => requestResult.error);
              }
              if (requestResult.isSuccess) {
                return of(requestResult.responseData);
              }
              return EMPTY;
            }),
            take(1),
          );
        }

        updateRequestResult(key, {
          isLoading: true,
          isError: false,
          isSuccess: false,
          status: 'loading',
          fetchStatus: 'fetching',
        });

        let sourceData: TData;
        return source.pipe(
          tap({
            error(error) {
              updateRequestResult(key, {
                isError: true,
                isLoading: false,
                isSuccess: false,
                status: 'error',
                fetchStatus: 'idle',
                errorUpdatedAt: Date.now(),
                error,
              });
            },
            next(data) {
              sourceData = data;
            },
            complete() {
              const newResult: SuccessRequestResult = {
                isLoading: false,
                isSuccess: true,
                isError: false,
                status: 'success',
                fetchStatus: 'idle',
                responseData: cacheResponseData ? sourceData : undefined,
                dataUpdatedAt: Date.now(),
                successfulRequestsCount: result.successfulRequestsCount + 1,
              };

              if (options?.staleTime) {
                newResult.staleTime = Date.now() + options.staleTime;
              }

              updateRequestResult(key, newResult);

              if (options?.additionalKeys) {
                const mainKey = resolveKey(key);
                for (const keys of options.additionalKeys(sourceData)) {
                  emitters.set(resolveKey(keys), emitters.get(mainKey)!);
                }
              }
            },
            finalize() {
              const mainKey = resolveKey(key);
              const currentResult = emitters.get(mainKey)?.getValue();
              if (currentResult?.fetchStatus === 'fetching') {
                updateRequestResult(key, {
                  isLoading: false,
                  isSuccess: false,
                  isError: false,
                  status: 'idle',
                  fetchStatus: 'idle',
                  staleTime: Date.now(),
                });
              }
            },
          }),
        );
      }),
    );
  };
}

export function filterSuccess<TData>(): OperatorFunction<
  RequestResult & { data: TData },
  SuccessRequestResult & { data: TData }
> {
  return filter(
    (result): result is SuccessRequestResult & { data: TData } =>
      result.status === 'success',
  );
}

export function filterError<TError>(): OperatorFunction<
  RequestResult<TError>,
  ErrorRequestResult<TError>
> {
  return filter(
    (result): result is ErrorRequestResult<TError> => result.status === 'error',
  );
}

export function mapResultData<TData, R>(
  mapFn: (data: NonNullable<TData>) => R,
): MonoTypeOperatorFunction<RequestResult & { data: TData }> {
  return pipe(
    map((result) => {
      return {
        ...result,
        data: result.data != null ? mapFn(result.data as any) : result.data,
      } as any;
    }),
  );
}
