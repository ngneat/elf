import { capitalize } from './utils';
import { propsFactory } from './props-factory';
import { Reducer } from './store';
import { isObject } from './utils';
import { EmptyConfig } from './state';

export function propsArrayFactory<
  T extends any[],
  K extends string,
  Props extends { [Key in K]: T },
  Config = EmptyConfig
>(key: K, options: { initialValue: T; config?: Config; idKey?: keyof T[0] }) {
  const normalizedKey = capitalize(key as string);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { idKey, ...baseOptions } = options;

  const base = propsFactory<T, K, Props, Config>(key, baseOptions);
  const arrayOptions = { idKey: options?.idKey ?? 'id' };

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
          [key]: arrayRemove(state[key], id, arrayOptions),
        };
      };
    },
    [`toggle${normalizedKey}`](id: any) {
      return function (state: any) {
        return {
          ...state,
          [key]: arrayToggle(state[key], id, arrayOptions),
        };
      };
    },
  } as unknown as typeof base & {
    [P in
      | `remove${Capitalize<K>}`
      | `add${Capitalize<K>}`
      | `toggle${Capitalize<K>}`]: P extends `toggle${Capitalize<K>}`
      ? <S extends Props>(value: T[0]) => Reducer<S>
      : P extends `add${Capitalize<K>}`
      ? <S extends Props>(value: T[0]) => Reducer<S>
      : P extends `remove${Capitalize<K>}`
      ? <S extends Props>(value: T[0]) => Reducer<S>
      : never;
  };
}

export function arrayAdd<T extends any[]>(arr: T, item: T[0]): T {
  return [...arr, item] as T;
}

export function arrayRemove<T extends any[], IdKey extends keyof T[0]>(
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

export function arrayToggle<T extends any[], IdKey extends keyof T[0]>(
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
