import { EmptyConfig, State } from '../core/state';

export type ErrorState<E = any> = {
  $error: E;
}

export function withError<E>(): State<ErrorState<E | undefined>, EmptyConfig> {
  return {
    state: {
      $error: undefined
    },
    config: {}
  };
}
