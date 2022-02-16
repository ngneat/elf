import { Reducer } from './store';
import { isFunction } from './utils';

/**
 *
 * Update a root property of the state
 *
 * @example
 *
 * store.update(setProp('foo', 'bar'))
 *
 * @example
 *
 * store.update(setProp('count', count => count + 1))
 *
 */
export function setProp<S extends Record<string, any>, K extends keyof S>(
  key: K,
  value: S[K] | ((current: S[K]) => S[K])
): Reducer<S> {
  return function (state) {
    return {
      ...state,
      [key]: isFunction(value) ? value(state[key]) : value,
    };
  };
}
