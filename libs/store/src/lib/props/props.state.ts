import { EmptyConfig, State } from '../core/state';

export function withProps<T>(props: T): State<T, EmptyConfig> {
  return {
    state: props,
    config: {}
  };
}
