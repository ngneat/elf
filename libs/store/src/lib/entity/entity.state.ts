import { State } from '../core/state';
import { Store } from '@eleanor/store';

export function withEntities<EntityType, IdType extends PropertyKey>(config: Partial<Config> = {}): State<EntityState<EntityType, IdType>, Config> {
  return {
    state: {
      $entities: {} as EntityState<EntityType, IdType>['$entities'],
      $ids: []
    },
    config: {
      idKey: config?.idKey ?? 'id'
    }
  };
}

export function getIdKey(store: Store) {
  return store.getConfig<Config>().idKey;
}

export interface EntityState<EntityType = any, IdType extends PropertyKey = any> {
  $entities: Record<IdType, EntityType>;
  $ids: Array<IdType>;
}

interface Config {
  idKey: string;
}

export type getEntityType<S> = S extends EntityState<infer I> ? I : never;
export type getIdType<S> = S extends EntityState<any, infer I> ? I : never;
export type Project<E, R> = (entity: E) => R;
export type ItemPredicate<Item> = (item: Item, index?: number) => boolean;
