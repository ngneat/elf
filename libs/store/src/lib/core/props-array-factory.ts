import { arrayAdd, arrayRemove, arrayToggle } from '../array';
import { capitalize } from './utils';
import { propsFactory } from './props-factory';
import { Reducer } from './store';

export function propsArrayFactory<
  T extends any[],
  K extends string,
  PropState extends { [Key in K]: T }
>(key: K, options: { initialValue: T; config?: any; idKey?: keyof T[0] }) {
  const normalizedKey = capitalize(key as string);
  const base = propsFactory<T, K, PropState>(key, options);

  return {
    ...base,
    [`add${normalizedKey}`](value: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayAdd(state[key], value),
        };
      };
    },
    [`remove${normalizedKey}`](id: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayRemove(state[key], id),
        };
      };
    },
    [`toggle${normalizedKey}`](id: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayToggle(state[key], id, { idKey: options?.idKey ?? 'id' }),
        };
      };
    },
  } as unknown as typeof base &
    {
      [P in
        | `remove${Capitalize<K>}`
        | `add${Capitalize<K>}`
        | `toggle${Capitalize<K>}`]: P extends `toggle${Capitalize<K>}`
        ? <S extends PropState>(value: T[0]) => Reducer<S>
        : P extends `add${Capitalize<K>}`
        ? <S extends PropState>(value: T[0]) => Reducer<S>
        : P extends `remove${Capitalize<K>}`
        ? <S extends PropState>(value: T[0]) => Reducer<S>
        : never;
    };
}
