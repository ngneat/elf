import { capitalize } from './utils';
import { propsFactory } from './props-factory';
import { Reducer } from './store';
import { isObject } from './utils';

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

function arrayAdd<T extends any[]>(arr: T, item: T[0]): T {
  return [...arr, item] as T;
}

function arrayRemove<T extends any[], IdKey extends keyof T[0]>(
  arr: T,
  id: T[0] extends Record<any, any> ? T[0][IdKey] : T[0],
  options?: T[0] extends Record<any, any> ? { idKey: IdKey } : never
): T {
  const isPrimitive = !isObject(arr[0]);
  const idKey = options?.idKey ?? ('id' as IdKey);

  return arr.filter((current) => {
    if (isPrimitive) {
      return id !== current;
    }

    return current[idKey] !== id;
  }) as T;
}

function arrayToggle<T extends any[], IdKey extends keyof T[0]>(
  arr: T,
  item: T[0],
  options?: T[0] extends Record<any, any> ? { idKey: IdKey } : never
): T {
  const isPrimitive = !isObject(arr[0]);
  const idKey = options?.idKey ?? 'id';

  const isExists = arr.find((current) => {
    if (isPrimitive) {
      return current === item;
    }

    return item[idKey] === current[idKey];
  });

  return isExists
    ? arrayRemove(arr, isPrimitive ? item : item[idKey], options as any)
    : arrayAdd(arr, item);
}
