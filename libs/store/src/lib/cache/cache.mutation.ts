import { CacheState } from './cache.state';
import { Reducer } from '@eleanor/store';

export function setCache<S extends CacheState>(cache: CacheState['$cache']): Reducer<S> {
  return state => {
    return {
      ...state,
      $cache: cache
    };
  };
}
