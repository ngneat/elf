import { propsFactory } from '../core/props-factory';

export type CacheStatus = 'none' | 'partial' | 'full';

export const {
  withCacheStatus,
  resetCacheStatus,
  selectCacheStatus,
  setCacheStatus,
} = propsFactory<{
  cacheStatus: CacheStatus;
}>('cacheStatus', 'none');
