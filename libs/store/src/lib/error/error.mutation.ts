import { ErrorState } from './error.state';
import { Reducer } from '@eleanor/store';

type getErrorType<S> = S extends ErrorState<infer I> ? I : never;

export function setError<S extends ErrorState>(error: getErrorType<S>): Reducer<S> {
  return function(state: S) {
    return {
      ...state,
      $error: error
    };
  };
}
