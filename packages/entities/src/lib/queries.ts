import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
} from './entity.state';
import { Query } from '@ngneat/elf';

/**
 *
 * Get the entities collection
 *
 * @example
 *
 * store.query(getEntities())
 *
 */
export function getEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}): Query<S, getEntityType<S, Ref>[]> {
  const { ref: { entitiesKey, idsKey } = defaultEntitiesRef } = options;

  return function (state) {
    return state[idsKey].map((id: getIdType<S, Ref>) => state[entitiesKey][id]);
  };
}

/**
 *
 * Get an entity
 *
 * @example
 *
 * store.query(getEntity(1))
 *
 */
export function getEntity<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,

  options: BaseEntityOptions<Ref> = {}
): Query<S, getEntityType<S, Ref> | undefined> {
  return function (state) {
    const { ref: { entitiesKey } = defaultEntitiesRef } = options;

    return state[entitiesKey][id];
  };
}

/**
 *
 * Check whether the entity exist
 *
 * @example
 *
 * store.query(hasEntity(1))
 *
 */
export function hasEntity<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,

  options: BaseEntityOptions<Ref> = {}
): Query<S, boolean> {
  return function (state) {
    const { ref: { entitiesKey } = defaultEntitiesRef } = options;

    return Reflect.has(state[entitiesKey], id);
  };
}
