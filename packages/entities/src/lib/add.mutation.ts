import {
  BaseEntityOptions,
  DefaultEntitiesRef,
  defaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdKey,
  getIdType,
} from './entity.state';
import { OrArray, Reducer, coerceArray } from '@ngneat/elf';
import { buildEntities } from './entity.utils';
import { deleteEntities } from './delete.mutation';

export interface AddEntitiesOptions {
  prepend?: boolean;
}

/**
 *
 * Add entities
 *
 * @example
 *
 * store.update(addEntities(entity))
 *
 * store.update(addEntities([entity, entity]))
 *
 * store.update(addEntities([entity, entity]), { prepend: true })
 *
 */
export function addEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  entities: OrArray<getEntityType<S, Ref>>,
  options: AddEntitiesOptions & BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function (state, context) {
    const { prepend = false, ref = defaultEntitiesRef } = options;

    const { entitiesKey, idsKey } = ref!;

    const asArray = coerceArray(entities);

    if (!asArray.length) return state;

    const { ids, asObject } = buildEntities<S, Ref>(
      asArray,
      getIdKey(context, ref)
    );

    return {
      ...state,
      [entitiesKey]: { ...state[entitiesKey], ...asObject },
      [idsKey]: prepend
        ? [...ids, ...state[idsKey]]
        : [...state[idsKey], ...ids],
    };
  };
}

/**
 *
 * Add entities using fifo
 *
 * @example
 *
 *
 * store.update(addEntitiesFifo([entity, entity]), { limit: 3 })
 *
 */
export function addEntitiesFifo<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  entities: OrArray<getEntityType<S, Ref>>,
  options: {
    limit: number;
  } & BaseEntityOptions<Ref>
): Reducer<S> {
  return function (state, context) {
    const { ref = defaultEntitiesRef, limit } = options;

    const { entitiesKey, idsKey } = ref!;
    const currentIds: getIdType<S, Ref>[] = state[idsKey];

    let normalizedEntities = coerceArray(entities);
    let newState: S = state;

    if (normalizedEntities.length > limit) {
      // Remove new entities that passes the limit
      normalizedEntities = normalizedEntities.slice(
        normalizedEntities.length - limit
      );
    }

    const total = currentIds.length + normalizedEntities.length;

    // Remove exiting entities that passes the limit
    if (total > limit) {
      const idsRemove = currentIds.slice(0, total - limit);
      newState = deleteEntities<S, Ref>(idsRemove)(state, context);
    }

    const { ids, asObject } = buildEntities<S, Ref>(
      normalizedEntities,
      getIdKey(context, ref)
    );

    return {
      ...state,
      [entitiesKey]: { ...newState[entitiesKey], ...asObject },
      [idsKey]: [...newState[idsKey], ...ids],
    };
  };
}
