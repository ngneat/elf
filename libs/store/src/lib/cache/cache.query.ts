import { select } from '../core/queries';
import { CacheState } from './cache.state';

export function selectCache<S extends CacheState>() {
  return select<S, S['$cache']>(state => state.$cache);
}
