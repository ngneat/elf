import { coerceArray, isFunction } from '../core/utils';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdType } from './entity.state';
import { OrArray } from '../core/types';
import { Reducer, Store } from '../core/store';

export type UpdateFn<Entity> = Partial<Entity> | ((entity: Entity) => Entity);

function toModel<Entity>(updater: UpdateFn<Entity>, entity: Entity): Entity {
  if(isFunction(updater)) {
    return updater(entity);
  }

  return {
    ...entity,
    ...updater
  };
}

/**
 *
 * Update entities in the store
 *
 * store.reduce(updateEntities(id, { name }))
 * store.reduce(updateEntities(id, entity => ({ ...entity, name })))
 * store.reduce(updateEntities([id, id, id], { open: true }))
 *
 */
export function updateEntities<S extends EntitiesRecord, U extends UpdateFn<getEntityType<S, Ref>>, Ref extends EntitiesRef = DefaultEntitiesRef>(
  ids: OrArray<getIdType<S, Ref>>,
  updateFn: U,
  options: BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function reducer(state: S) {
    const { ref: { entitiesKey } = defaultEntitiesRef } = options;
    const updatedEntities = {} as Record<getIdType<S, Ref>, getEntityType<S, Ref>>;

    for(const id of coerceArray(ids)) {
      updatedEntities[id] = toModel<getEntityType<S, Ref>>(updateFn, state[entitiesKey][id]);
    }

    return {
      ...state,
      [entitiesKey]: { ...state[entitiesKey], ...updatedEntities }
    };
  };
}

/**
 *
 * Update all entities in the store
 *
 * store.reduce(updateAllEntities({ name }))
 * store.reduce(updateAllEntities(entity => ({ ...entity, name })))
 *
 */
export function updateAllEntities<S extends EntitiesRecord, U extends UpdateFn<getEntityType<S, Ref>>, Ref extends EntitiesRef = DefaultEntitiesRef>(updateFn: U, options: BaseEntityOptions<Ref> = {}): Reducer<S> {
  return function reducer(state: S, store: Store) {
    const { ref: { idsKey } = defaultEntitiesRef } = options;

    return updateEntities(state[idsKey], updateFn, options)(state, store);
  };
}
