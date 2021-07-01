import { propsFactory } from '../core/props-factory';
import { CacheState } from '../core/types';

export const { withCache, resetCache, selectCache, setCache } = propsFactory<{
  cache: CacheState;
}>('cache', 'none');
