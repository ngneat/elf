import { coerceArray } from '../core/utils';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getIdType } from './entity.state';
import { OrArray } from '../core/types';
import { Reducer } from '../core/store';

/**
 *
 * Remove entities from the store
 *
 * store.reduce(removeEntity(1)
 *
 * store.reduce(removeEntity([1, 2, 3])
 *
 */
export function removeEntity<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(ids: OrArray<getIdType<S, Ref>>, options: BaseEntityOptions<Ref> = {}): Reducer<S> {
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
 * Remove all entities from the store
 *
 * store.reduce(removeAll())
 *
 */
export function removeAll<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(options: BaseEntityOptions<Ref> = {}): Reducer<S> {
  return function reducer(state: S) {
    const { ref: { idsKey, entitiesKey } = defaultEntitiesRef } = options;

    return {
      ...state,
      [entitiesKey]: {},
      [idsKey]: []
    };
  };
}
