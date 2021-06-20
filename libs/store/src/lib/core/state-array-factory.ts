import { arrayAdd, arrayRemove, arrayToggle } from '../array';
import { Reducer, stateFactory } from '@ngneat/elf';
import { capitalize } from './utils';

export function stateArrayFactory<
  T extends Record<any, any[]>,
  K extends keyof T = T extends Record<infer Key, any> ? Key : never
>(key: K, initialValue: T[K], options?: { idKey: keyof T[0] }) {
  const normalizedKey = capitalize(key as string);
  const base = stateFactory<T, K>(key, initialValue);

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
        | `remove${Capitalize<string & K>}`
        | `add${Capitalize<string & K>}`
        | `toggle${Capitalize<string & K>}`]: P extends `toggle${Capitalize<
        string & K
      >}`
        ? <S extends T>(value: S[K][0]) => Reducer<S>
        : P extends `add${Capitalize<string & K>}`
        ? <S extends T>(value: S[K][0]) => Reducer<S>
        : P extends `remove${Capitalize<string & K>}`
        ? <S extends T>(value: S[K][0]) => Reducer<S>
        : never;
    };
}
