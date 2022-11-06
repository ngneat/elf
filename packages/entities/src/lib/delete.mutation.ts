import { coerceArray, EntityActions, OrArray, Reducer } from '@ngneat/elf';
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
import { findIdsByPredicate } from './entity.utils';

/**
 *
 * Remove entities
 *
 * @example
 *
 * store.update(deleteEntities(1))
 *
 * store.update(deleteEntities([1, 2, 3])
 *
 */
export function deleteEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  ids: OrArray<getIdType<S, Ref>>,
  options: BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function (state, context) {
    const { ref: { idsKey, entitiesKey } = defaultEntitiesRef } = options;

    const idsToRemove = coerceArray(ids);
    const newEntities = { ...state[entitiesKey] };
    const newIds = state[idsKey].filter(
      (id: getIdType<S, Ref>) => !idsToRemove.includes(id)
    );

    for (const id of idsToRemove) {
      Reflect.deleteProperty(newEntities, id);
    }

    context.actions.next({ type: EntityActions.Remove, ids: idsToRemove });

    return {
      ...state,
      [entitiesKey]: newEntities,
      [idsKey]: newIds,
    };
  };
}

/**
 *
 * Remove entities by predicate
 *
 * @example
 *
 * store.update(deleteEntitiesByPredicate(entity => entity.count === 0))
 *
 */
export function deleteEntitiesByPredicate<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options: BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function reducer(state, context) {
    const ids = findIdsByPredicate(
      state,
      options.ref || (defaultEntitiesRef as Ref),
      predicate
    );

    if (ids.length) {
      context.actions.next({ type: EntityActions.Remove, ids: ids });

      return deleteEntities(ids, options)(state, context) as S;
    }

    return state;
  };
}

/**
 *
 * Remove all entities
 *
 * @example
 *
 * store.update(deleteAllEntities())
 *
 */
export function deleteAllEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}): Reducer<S> {
  return function reducer(state: S, context) {
    const { ref: { idsKey, entitiesKey } = defaultEntitiesRef } = options;

    if (state.ids.length) {
      context.actions.next({ type: EntityActions.Remove, ids: state.ids });
    }

    return {
      ...state,
      [entitiesKey]: {},
      [idsKey]: [],
    };
  };
}
