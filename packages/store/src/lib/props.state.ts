import { EmptyConfig, State } from './state';

export function withProps<T>(props: T): State<T, EmptyConfig> {
  return {
    state: props,
    config: {},
  };
}
