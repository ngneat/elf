import { coerceArray, isFunction } from '../core/utils';
import { EntityState, getEntityType, getIdType } from './entity.state';
import { Reducer, Store } from '@eleanor/store';
import { OrArray } from '../core/types';

interface Options<EntityState> {
  createFactory(id: getIdType<EntityState>, updatedState: getEntityType<EntityState>): getEntityType<EntityState>;
}

export type UpdateFn<Entity> = Partial<Entity> | ((entity: Entity) => Entity);

function toModel<Entity>(entity: UpdateFn<Entity>, state: Entity): Entity {
  if(isFunction(entity)) {
    return entity(state);
  }

  return {
    ...state,
    ...entity
  };
}

export function updateEntity<S extends EntityState>(ids: OrArray<getIdType<S>>, updateFn: UpdateFn<getEntityType<S>>, options?: Options<S>): Reducer<S> {
  return function reducer(state: S) {
    const updatedEntities: EntityState['$entities'] = {};
    const createFactory = options?.createFactory;
    const newIds: EntityState['$ids'] = [];

    for(const id of coerceArray(ids)) {
      if(id in state.$entities) {
        updatedEntities[id] = toModel<getEntityType<S>>(updateFn, state.$entities[id]);
      } else if(createFactory) {
        updatedEntities[id] = createFactory(id, toModel(updateFn, state.$entities[id]));
        newIds.push(id);
      }
    }

    return {
      ...state,
      $ids: newIds.length ? [...state.$ids, ...newIds ] : ids,
      $entities: { ...state.$entities, ...updatedEntities }
    };
  };
}

export function updateAll<S extends EntityState>(updateFn: UpdateFn<getEntityType<S>>, options?: Options<S>): Reducer<S> {
  return function reducer(state: S, store: Store) {
    return updateEntity(state.$ids, updateFn, options)(state, store);
  };
}
