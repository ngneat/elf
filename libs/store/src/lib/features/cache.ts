import {Query, StateOf} from "../core/types";
import {EMPTY, Observable, OperatorFunction} from "rxjs";
import {Reducer, Store, StoreDef} from "../core/store";
import { propsFactory } from "../core/props-factory";
import { select } from "../core/operators";

export type CacheStatus = 'none' | 'partial' | 'full';

export const {
  withCache,
  setCache,
  selectCache,
  resetCache,
  getCache,
  updateCache
} = propsFactory<{ cache: Record<string | number, CacheStatus> }>('cache', {});

export function deleteCacheEntry<S extends StateOf<typeof withCache>>(key: string | number): Reducer<S> {
  return function (state: S) {
    const cache = {...state.cache};

    if (Reflect.deleteProperty(cache, key)) {
      return {
        ...state,
        cache
      }
    }

    return state;
  }
}

export function inCache<S extends StateOf<typeof withCache>>(key: string | number, status?: CacheStatus): Query<S, boolean> {
  return function (state: S) {
    if (status) {
      return state.cache[key] === status;
    }

    return Reflect.has(state.cache, key);
  }
}

export function selectInCache<S extends StateOf<typeof withCache>>(key: string | number, status?: CacheStatus): OperatorFunction<S, boolean> {
  return select(state => inCache(key, status)(state));
}


export function skipWhileCached<T, S extends StateOf<typeof withCache>>(store: Store<StoreDef<S>>, key: string, type?: CacheStatus) {
  return function (source: Observable<T>) {
    if (store.query(inCache(key, type))) {
      return EMPTY;
    }

    return source;
  }
}
