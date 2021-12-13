export {
  Store,
  Reducer,
  StoreValue,
  StoreDef,
  ReducerContext,
} from './lib/store';
export { propsFactory } from './lib/props-factory';
export { propsArrayFactory } from './lib/props-array-factory';
export {
  select,
  head,
  asap,
  filterNil,
  distinctUntilArrayItemChanged,
} from './lib/operators';
export {
  getStore,
  getRegistry,
  registry$,
  getStoresSnapshot,
} from './lib/registry';
export { withProps } from './lib/props.state';
export { createState, PropsFactory, EmptyConfig } from './lib/state';
export {
  isFunction,
  coerceArray,
  isObject,
  isString,
  isUndefined,
  capitalize,
} from './lib/utils';
export { StateOf, Query, OrArray, SomeArray } from './lib/types';
