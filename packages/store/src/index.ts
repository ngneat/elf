export { createStore, StoreConfig } from './lib/create-store';
export { setProp, setProps } from './lib/mutations';
export {
  asap,
  distinctUntilArrayItemChanged,
  filterNil,
  head,
  select,
} from './lib/operators';
export { propsArrayFactory } from './lib/props-array-factory';
export { propsFactory } from './lib/props-factory';
export { withProps } from './lib/props.state';
export {
  getRegistry,
  getStore,
  getStoresSnapshot,
  registry$,
} from './lib/registry';
export { createState, EmptyConfig, PropsFactory } from './lib/state';
export {
  Reducer,
  ReducerContext,
  Store,
  StoreDef,
  StoreValue,
} from './lib/store';
export { OrArray, Query, StateOf } from './lib/types';
export {
  capitalize,
  coerceArray,
  isFunction,
  isObject,
  isString,
  isUndefined,
} from './lib/utils';
