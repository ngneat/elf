import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
} from './entity.state';
import { Query } from '../core/types';

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
  return function (state: S) {
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
  return function (state: S) {
    const { ref: { entitiesKey } = defaultEntitiesRef } = options;

    return Reflect.has(state[entitiesKey], id);
  };
}
