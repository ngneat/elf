import { Reducer } from '../core/store';

type OnlyNumbers<T> = {
  [K in keyof T]: T[K] extends number ? K : never
}[keyof T]

export function increment<S, K extends OnlyNumbers<S>>(key: K, options?: { limit: number | undefined }): Reducer<S> {
  return function(state: S) {
    let current = state[key] as unknown as number;
    const limit = options?.limit;

    if(limit && current === limit) return state;

    return {
      ...state,
      [key]: ++current
    };
  };
}
