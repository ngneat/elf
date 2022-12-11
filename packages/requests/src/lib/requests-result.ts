import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  filter,
  map,
  MonoTypeOperatorFunction,
  Observable,
  OperatorFunction,
  pipe,
  switchMap,
  take,
  tap,
} from 'rxjs';

export interface BaseRequestResult {
  staleTime?: number;
  lastRequest?: number;
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
export function joinRequestResult<T, TError = any>(
  ...[key, options]: Parameters<typeof getRequestResult>
): OperatorFunction<T, RequestResult<TError> & { data: T }> {
  return function (source: Observable<T>) {
    return combineLatest([source, getRequestResult<TError>(key, options)]).pipe(
      map(([data, result]) => {
        return {
          ...result,
          data,
        };
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

        return source.pipe(
          tap({
            error(error) {
              updateRequestResult(key, {
                isError: true,
                isLoading: false,
                isSuccess: false,
                status: 'error',
                lastRequest: Date.now(),
                error,
              });
            },
            complete() {
              const newResult: SuccessRequestResult = {
                isLoading: false,
                isSuccess: true,
                isError: false,
                status: 'success',
                lastRequest: Date.now(),
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

export function filterSuccess<TData>(): OperatorFunction<
  RequestResult & { data: TData },
  SuccessRequestResult & { data: TData }
> {
  return filter(
    (result): result is SuccessRequestResult & { data: TData } =>
      result.status === 'success'
  );
}

export function filterError<TError>(): OperatorFunction<
  RequestResult<TError>,
  ErrorRequestResult<TError>
> {
  return filter(
    (result): result is ErrorRequestResult<TError> => result.status === 'error'
  );
}

export function mapResultData<TData, R>(
  mapFn: (data: NonNullable<TData>) => R
): MonoTypeOperatorFunction<RequestResult & { data: TData }> {
  return pipe(
    map((result) => {
      return {
        ...result,
        data: result.data != null ? mapFn(result.data as any) : result.data,
      } as any;
    })
  );
}
