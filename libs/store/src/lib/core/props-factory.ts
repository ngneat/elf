import { select } from './queries';
import { OperatorFunction } from 'rxjs';
import { EmptyConfig, State } from './state';
import { Reducer } from './store';

function capitalize(key: string) {
  return key.charAt(0).toUpperCase() + key.slice(1);
}

export function stateFactory<T extends Record<any, any>, K extends keyof T = T extends Record<infer Key, any> ? Key : never>(key: K) {
  const normalizedKey = capitalize(key as string);

  return {
    [`with${normalizedKey}`]: function(initialValue: any) {
      return {
        state: {
          [key]: initialValue
        },
        config: undefined
      };
    },
    [`set${normalizedKey}`]: function(value: any) {
      return function(state: any) {
        return {
          ...state,
          [key]: value
        };
      };
    },
    [`select${normalizedKey}`]: function() {
      return select((state: any) => state[key]);
    }

  } as unknown as {
    [P in `set${Capitalize<string & K>}` | `select${Capitalize<string & K>}` | `with${Capitalize<string & K>}`]:
    P extends `set${Capitalize<string & K>}` ?
      <S extends T>(value: S[K]) => Reducer<S> : P extends `select${Capitalize<string & K>}` ? <S extends T>() => OperatorFunction<S, S[K]> :
      (initialValue: T[K]) => State<T, EmptyConfig>
  };
}
