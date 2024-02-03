import { createState, Merge, PropsFactory } from './state';
import { Store } from './store';

export function createStore<
  S extends [PropsFactory<any, any>, ...PropsFactory<any, any>[]],
>(
  storeConfig: StoreConfig,
  ...propsFactories: S
): Store<{
  name: string;
  state: Merge<S, 'props'>;
  config: Merge<S, 'config'>;
}> {
  const { state, config } = createState(...propsFactories);
  const { name } = storeConfig;

  return new Store({ name, state, config });
}

export interface StoreConfig {
  name: string;
}
