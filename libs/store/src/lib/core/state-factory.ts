import { select } from './operators';
import { OperatorFunction } from 'rxjs';
import { EmptyConfig, State } from './state';
import { Reducer } from './store';
import { capitalize, isFunction } from './utils';

export function stateFactory<
  T extends Record<any, any>,
  K extends keyof T = T extends Record<infer Key, any> ? Key : never
>(key: K, initialValue: T[K]) {
  const normalizedKey = capitalize(key as string);

  return {
    [`with${normalizedKey}`](value = initialValue) {
      return {
        state: {
          [key]: value,
        },
        config: undefined,
      };
    },
    [`set${normalizedKey}`](value: any) {
      return function (state: any) {
        const newVal = isFunction(value) ? value(state) : value;

        return {
          ...state,
          [key]: newVal,
        };
      };
    },
    [`reset${normalizedKey}`]() {
      return function (state: any) {
        return {
          ...state,
          [key]: initialValue,
        };
      };
    },
    [`select${normalizedKey}`]() {
      return select((state: any) => state[key]);
    },
  } as unknown as {
    [P in
      | `set${Capitalize<string & K>}`
      | `reset${Capitalize<string & K>}`
      | `select${Capitalize<string & K>}`
      | `with${Capitalize<string & K>}`]: P extends `set${Capitalize<
      string & K
    >}`
      ? <S extends T>(value: S[K] | ((state: S) => S)) => Reducer<S>
      : P extends `select${Capitalize<string & K>}`
      ? <S extends T>() => OperatorFunction<S, S[K]>
      : P extends `reset${Capitalize<string & K>}`
      ? <S extends T>() => Reducer<S>
      : (initialValue?: T[K]) => State<T, EmptyConfig>;
  };
}
