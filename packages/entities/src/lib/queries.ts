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
 * store.query(getAllEntities())
 *
 */
export function getAllEntities<
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
 * Get the entities and apply filter/map
 *
 * @example
 *
 * store.query(getAllEntitiesApply())
 *
 */
export function getAllEntitiesApply<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef,
  R = getEntityType<S, Ref>
>(
  options: {
    mapEntity?(entity: getEntityType<S, Ref>): R;
    filterEntity?(entity: getEntityType<S, Ref>): boolean;
  } & BaseEntityOptions<Ref>
): Query<S, getEntityType<S, Ref>[]> {
  const {
    ref: { entitiesKey, idsKey } = defaultEntitiesRef,
    filterEntity = () => true,
    mapEntity = (e) => e,
  } = options;

  return function (state) {
    const result = [];

    for (const id of state[idsKey]) {
      const entity = state[entitiesKey][id];
      if (filterEntity(entity)) {
        result.push(mapEntity(entity));
      }
    }

    return result;
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
