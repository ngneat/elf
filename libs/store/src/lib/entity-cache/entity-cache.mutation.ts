import { Reducer } from '@eleanor/store';
import { EntityCacheState, EntityCacheStatus, getEntityCacheIdType } from './entity-cache.state';


export function setEntityCache<S extends EntityCacheState>(id: getEntityCacheIdType<S>, status: EntityCacheStatus = 'full'): Reducer<S> {
  return state => {
    return {
      ...state,
      $entitiesCache: {
        ...state.$entitiesCache,
        [id]: status
      }
    };
  };
}
