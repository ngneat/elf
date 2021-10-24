import { capitalize } from './utils';
import { propsFactory } from './props-factory';
import { Reducer } from './store';
import { EmptyConfig } from './state';
import { coerceArray } from './utils';
import { OrArray } from './types';

export function propsArrayFactory<
  T extends any[],
  K extends string,
  Props extends { [Key in K]: T },
  Config = EmptyConfig
>(key: K, options: { initialValue: T; config?: Config }) {
  const normalizedKey = capitalize(key);
  const base = propsFactory<T, K, Props, Config>(key, options);

  return {
    ...base,
    [`add${normalizedKey}`](items: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayAdd(state[key], items),
        };
      };
    },
    [`remove${normalizedKey}`](items: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayRemove(state[key], items),
        };
      };
    },
    [`toggle${normalizedKey}`](items: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayToggle(state[key], items),
        };
      };
    },
    [`update${normalizedKey}`](predicateOrIds: any, obj: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayUpdate(state[key], predicateOrIds, obj),
        };
      };
    },
    [`in${normalizedKey}`](item: any) {
      return (state: any) => inArray(state[key], item);
    },
  } as unknown as Omit<typeof base, `update${Capitalize<K>}`> & {
    [P in
      | `remove${Capitalize<K>}`
      | `add${Capitalize<K>}`
      | `in${Capitalize<K>}`
      | `update${Capitalize<K>}`
      | `toggle${Capitalize<K>}`]: P extends `toggle${Capitalize<K>}`
      ? <S extends Props>(value: OrArray<T[0]>) => Reducer<S>
      : P extends `add${Capitalize<K>}`
      ? <S extends Props>(value: OrArray<T[0]>) => Reducer<S>
      : P extends `remove${Capitalize<K>}`
      ? <S extends Props>(value: OrArray<T[0]>) => Reducer<S>
      : P extends `update${Capitalize<K>}`
      ? <S extends Props>(item: T[0], newItem: T[0]) => Reducer<S>
      : P extends `in${Capitalize<K>}`
      ? (value: T[0]) => <S extends Props>(state: S) => boolean
      : never;
  };
}

type OnlyPrimitive<T extends any[]> = T[0] extends Record<any, any> ? never : T;

export function arrayAdd<T extends any[]>(
  arr: OnlyPrimitive<T>,
  items: OrArray<T[0]>
): T {
  return [...arr, ...coerceArray(items)] as T;
}

export function arrayRemove<T extends any[]>(
  arr: OnlyPrimitive<T>,
  items: OrArray<T[0]>
): T {
  const toArray = coerceArray(items);

  return arr.filter((current) => !toArray.includes(current)) as T;
}

export function arrayToggle<T extends any[]>(
  arr: OnlyPrimitive<T>,
  items: OrArray<T[0]>
): T {
  const toArray = coerceArray(items);

  const result = [...arr];

  toArray.forEach((item) => {
    const i = result.indexOf(item);
    i > -1 ? result.splice(i, 1) : result.push(item);
  });

  return result as T;
}

export function inArray<T extends any[]>(arr: OnlyPrimitive<T>, item: T[0]) {
  return arr.includes(item);
}

export function arrayUpdate<T extends any[]>(
  arr: OnlyPrimitive<T>,
  item: T[0],
  newItem: T[0]
): T {
  return arr.map((current) => {
    return current === item ? newItem : current;
  }) as T;
}
