import { coerceArray } from '../core/utils';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdType, ItemPredicate } from './entity.state';
import { OrArray } from '../core/types';
import { Reducer, Store } from '../core/store';

/**
 *
 * Remove entities from the store
 *
 * store.reduce(removeEntities(1))
 *
 * store.reduce(removeEntities([1, 2, 3])
 *
 */
export function removeEntities<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(ids: OrArray<getIdType<S, Ref>>, options: BaseEntityOptions<Ref> = {}): Reducer<S> {
  return function reducer(state: S) {
    const { ref: { idsKey, entitiesKey } = defaultEntitiesRef } = options;

    const idsToRemove = coerceArray(ids);
    const newEntities = { ...state[entitiesKey] };
    const newIds = state[idsKey].filter((id: getIdType<S, Ref>) => !idsToRemove.includes(id));

    for(const id of idsToRemove) {
      delete newEntities[id];
    }

    return {
      ...state,
      [entitiesKey]: newEntities,
      [idsKey]: newIds
    };
  };
}

/**
 *
 * Remove entities from the store by predicate
 *
 * store.reduce(removeEntitiesByPredicate(entity => entity.count === 0))
 *
 *
 */
export function removeEntitiesByPredicate<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options: BaseEntityOptions<Ref> = {}): Reducer<S> {
  return function reducer(state: S, store: Store) {
    const { ref: { idsKey, entitiesKey } = defaultEntitiesRef } = options;
    const entities = state[entitiesKey];
    const ids = state[idsKey].filter((id: getIdType<S, Ref>) => predicate(entities[id]));

    if(ids.length) {
      return removeEntities(ids, options)(state, store);
    }

    return state;
  };
}

/**
 *
 * Remove all entities from the store
 *
 * store.reduce(removeAllEntities())
 *
 */
export function removeAllEntities<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(options: BaseEntityOptions<Ref> = {}): Reducer<S> {
  return function reducer(state: S) {
    const { ref: { idsKey, entitiesKey } = defaultEntitiesRef } = options;

    return {
      ...state,
      [entitiesKey]: {},
      [idsKey]: []
    };
  };
}
