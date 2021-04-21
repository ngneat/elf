import { coerceArray } from '../core/utils';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdKey, getIdType } from './entity.state';
import { Reducer, Store } from '@eleanor/store';
import { OrArray } from '../core/types';

/**
 *
 * Replace entities in the store
 *
 * store.reduce(replaceEntity(1, { entity }))
 *
 * store.reduce(replaceEntity([1, 2, 3], { entity }))
 *
 */
export function replaceEntity<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(
  ids: OrArray<getIdType<S, Ref>>,
  entity: getEntityType<S, Ref>,
  options: BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function reducer(state: S, store: Store) {
    const { ref: { entitiesKey } = defaultEntitiesRef } = options;

    const updatedEntities = {} as Record<getIdType<S, Ref>, getEntityType<S, Ref>>;
    const idKey = getIdKey<getIdType<S, Ref>>(store);

    for(const id of coerceArray(ids)) {
      updatedEntities[id] = {
        [idKey]: id,
        ...entity
      };
    }

    return {
      ...state,
      [entitiesKey]: { ...state[entitiesKey], ...updatedEntities }
    };
  };
}
