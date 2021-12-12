import { EmptyConfig, PropsFactory } from './state';

export function withProps<T>(props: T): PropsFactory<T, EmptyConfig> {
  return {
    props,
    config: undefined,
  };
}
