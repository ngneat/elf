import { coerceArray, isFunction } from '../core/utils';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdType } from './entity.state';
import { OrArray } from '../core/types';
import { Reducer, Store } from '../core/store';

interface Options<S extends EntitiesRecord,
  Ref extends EntitiesRef,
  U,
  EntityType = getEntityType<S, Ref>> extends BaseEntityOptions<Ref> {
  createFactory(id: getIdType<S, Ref>, updatedState: U extends ((entity: EntityType) => EntityType) ? EntityType : Partial<EntityType>): EntityType;
}

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
  options: Options<S, Ref, U>
): Reducer<S> {
  return function reducer(state: S) {
    const { ref: { entitiesKey, idsKey } = defaultEntitiesRef, createFactory } = options;
    const updatedEntities = {} as Record<getIdType<S, Ref>, getEntityType<S, Ref>>;
    const newIds = [] as getIdType<S, Ref>[];

    for(const id of coerceArray(ids)) {
      if(Object.prototype.hasOwnProperty.call(state[entitiesKey], id)) {
        updatedEntities[id] = toModel<getEntityType<S, Ref>>(updateFn, state[entitiesKey][id]);
      } else if(createFactory) {
        updatedEntities[id] = createFactory(id, toModel<getEntityType<S, Ref>>(updateFn, {} as getEntityType<S, Ref>));
        newIds.push(id);
      }
    }

    return {
      ...state,
      [idsKey]: newIds.length ? [...state[idsKey], ...newIds] : ids,
      [entitiesKey]: { ...state[entitiesKey], ...updatedEntities }
    };
  };
}

export function updateAll<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef, U = UpdateFn<getEntityType<S, Ref>>>(updateFn: UpdateFn<getEntityType<S, Ref>>, options: Options<S, Ref, U>): Reducer<S> {
  return function reducer(state: S, store: Store) {
    return updateEntity(state.$ids, updateFn, options)(state, store);
  };
}
