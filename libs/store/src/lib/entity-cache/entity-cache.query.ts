import { select } from '../core/queries';
import { EntityCacheState, EntityCacheStatus, getEntityCacheIdType } from './entity-cache.state';
import { isUndefined } from '../core/utils';
import { OperatorFunction } from 'rxjs';

export function selectEntityCache<S extends EntityCacheState>(id: getEntityCacheIdType<S>): OperatorFunction<S, EntityCacheStatus>;
export function selectEntityCache<S extends EntityCacheState>(): OperatorFunction<S, S['$entitiesCache']>;
export function selectEntityCache<S extends EntityCacheState>(id?: any): any {
  return select<S, any>(state => {
    return isUndefined(id) ? state.$entitiesCache : state.$entitiesCache[id];
  });
}
