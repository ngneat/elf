import { coerceArray, isFunction } from '../core/utils';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdType } from './entity.state';
import { OrArray } from '../core/types';
import { Reducer, Store } from '../core/store';

type Options<Ref extends EntitiesRef> = BaseEntityOptions<Ref>

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

export function updateEntity<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef, U = UpdateFn<getEntityType<S, Ref>>>(
  ids: OrArray<getIdType<S, Ref>>,
  updateFn: U,
  options: Options<Ref> = {}
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

export function updateAll<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef, U = UpdateFn<getEntityType<S, Ref>>>(updateFn: U, options: Options<Ref>): Reducer<S> {
  return function reducer(state: S, store: Store) {
    const { ref: { idsKey } = defaultEntitiesRef } = options;

    return updateEntity(state[idsKey], updateFn, options)(state, store);
  };
}
