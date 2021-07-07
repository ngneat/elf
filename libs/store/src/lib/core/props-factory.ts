import {select} from './operators';
import {OperatorFunction} from 'rxjs';
import {EmptyConfig, State} from './state';
import {Reducer} from './store';
import {capitalize, isFunction, isObject} from './utils';

export function propsFactory<T extends Record<any, any>,
  K extends keyof T = T extends Record<infer Key, any> ? Key : never>(key: K, initialValue: T[K]) {
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
    [`update${normalizedKey}`](value: any) {
      return function (state: any) {
        const newVal = isFunction(value) ? value(state) : value;

        return {
          ...state,
          [key]: isObject(value) ? {
            ...state[key],
            ...newVal
          } : newVal
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
    [`get${normalizedKey}`](state: any) {
      return state[key];
    },
  } as unknown as {
    [P in | `get${Capitalize<string & K>}`
      | `set${Capitalize<string & K>}`
      | `update${Capitalize<string & K>}`
      | `reset${Capitalize<string & K>}`
      | `select${Capitalize<string & K>}`
      | `with${Capitalize<string & K>}`]:

    P extends `set${Capitalize<string & K>}`
      ? <S extends T>(value: S[K] | ((state: S) => S[K])) => Reducer<S> :
      P extends `update${Capitalize<string & K>}`
        ? <S extends T>(value: Partial<S[K]>) => Reducer<S>
        : P extends `get${Capitalize<string & K>}`
        ? <S extends T>() => S[K]
        : P extends `select${Capitalize<string & K>}`
          ? <S extends T>() => OperatorFunction<S, S[K]>
          : P extends `reset${Capitalize<string & K>}`
            ? <S extends T>() => Reducer<S>
            : (initialValue?: T[K]) => State<T, EmptyConfig>;
  };
}
