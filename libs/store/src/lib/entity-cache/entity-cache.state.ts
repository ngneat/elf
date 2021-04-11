import { EmptyConfig, State } from '../core/state';

export type EntityCacheStatus = 'empty' | 'partial' | 'full';

export type EntityCacheState<IdType extends PropertyKey = any> = {
  $entitiesCache: Record<IdType, EntityCacheStatus>;
}

export type getEntityCacheIdType<S> = S extends EntityCacheState<infer I> ? I : never;

export function withEntityCache<IdType extends PropertyKey>(): State<EntityCacheState<IdType>, EmptyConfig> {
  return {
    state: {
      $entitiesCache: {} as EntityCacheState<IdType>['$entitiesCache']
    },
    config: {}
  };
}
