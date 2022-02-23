import { createState, PropsFactory } from './state';
import { Store } from './store';

export function createStore<
  S extends [PropsFactory<any, any>, ...PropsFactory<any, any>[]]
>(storeConfig: StoreConfig, ...propsFactories: S) {
  const { state, config } = createState(...propsFactories);
  const { name } = storeConfig;

  return new Store({ name, state, config });
}

export interface StoreConfig {
  name: string;
}
