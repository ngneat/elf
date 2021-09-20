import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
  ItemPredicate,
} from './entity.state';
import { Reducer, OrArray, coerceArray, isFunction } from '@ngneat/elf';
import { findIdsByPredicate } from './entity.utils';
import { hasEntity } from './queries';
import { addEntities, AddEntitiesOptions } from './add.mutation';

export type UpdateFn<Entity> = Partial<Entity> | ((entity: Entity) => Entity);

function toModel<Entity>(updater: UpdateFn<Entity>, entity: Entity): Entity {
  if (isFunction(updater)) {
    return updater(entity);
  }

  return {
    ...entity,
    ...updater,
  };
}

/**
 *
 * Update entities
 *
 * @example
 *
 * store.reduce(updateEntities(id, { name }))
 * store.reduce(updateEntities(id, entity => ({ ...entity, name })))
 * store.reduce(updateEntities([id, id, id], { open: true }))
 *
 */
export function updateEntities<
  S extends EntitiesState<Ref>,
  U extends UpdateFn<getEntityType<S, Ref>>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  ids: OrArray<getIdType<S, Ref>>,
  updater: U,
  options: BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function (state) {
    const { ref: { entitiesKey } = defaultEntitiesRef } = options;
    const updatedEntities = {} as Record<
      getIdType<S, Ref>,
      getEntityType<S, Ref>
    >;

    for (const id of coerceArray(ids)) {
      updatedEntities[id] = toModel<getEntityType<S, Ref>>(
        updater,
        state[entitiesKey][id]
      );
    }

    return {
      ...state,
      [entitiesKey]: { ...state[entitiesKey], ...updatedEntities },
    };
  };
}

/**
 *
 * Update entities by predicate
 *
 * @example
 *
 * store.reduce(updateEntitiesByPredicate(entity => entity.count === 0))
 *
 */
export function updateEntitiesByPredicate<
  S extends EntitiesState<Ref>,
  U extends UpdateFn<getEntityType<S, Ref>>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  updater: U,
  options: BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function (state, context) {
    const ids = findIdsByPredicate(
      state,
      options.ref || (defaultEntitiesRef as Ref),
      predicate
    );

    if (ids.length) {
      return updateEntities(ids, updater, options)(state, context) as S;
    }

    return state;
  };
}

/**
 *
 * Update all entities
 *
 * @example
 *
 * store.reduce(updateAllEntities({ name }))
 * store.reduce(updateAllEntities(entity => ({ ...entity, name })))
 *
 */
export function updateAllEntities<
  S extends EntitiesState<Ref>,
  U extends UpdateFn<getEntityType<S, Ref>>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(updater: U, options: BaseEntityOptions<Ref> = {}): Reducer<S> {
  return function (state, context) {
    const { ref: { idsKey } = defaultEntitiesRef } = options;

    return updateEntities(state[idsKey], updater, options)(state, context) as S;
  };
}

type CreateFn<Entity, ID> = (id: ID) => Entity;

/**
 *
 * Update entities that exists, add those who don't
 *
 * @example
 *
 */
export function upsertEntities<
  S extends EntitiesState<Ref>,
  U extends UpdateFn<EntityType>,
  C extends CreateFn<EntityType, getIdType<S, Ref>>,
  Ref extends EntitiesRef = DefaultEntitiesRef,
  EntityType = getEntityType<S, Ref>
>(
  ids: OrArray<getIdType<S, Ref>>,
  {
    updater,
    creator,
    ...options
  }: {
    updater: U;
    creator: C;
    mergeUpdaterWithCreator?: boolean;
  } & AddEntitiesOptions &
    BaseEntityOptions<Ref>
): Reducer<S> {
  return function (state, context) {
    const updatedEntitiesIds = [];
    const newEntities = [];

    for (const id of coerceArray(ids)) {
      if (hasEntity(id, options)(state)) {
        updatedEntitiesIds.push(id);
      } else {
        let newEntity = creator(id);
        if (options.mergeUpdaterWithCreator) {
          newEntity = toModel(updater, newEntity);
        }
        newEntities.push(newEntity);
      }
    }
    const newState = updateEntities(
      updatedEntitiesIds,
      updater,
      options
    )(state, context);

    return addEntities(newEntities, options)(newState, context) as S;
  };
}
