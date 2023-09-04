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
import { Query } from '@ngneat/elf';
import { checkPluck } from './entity.utils';

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
): Query<S, R[]> {
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
 * Get first entity by predicate
 *
 * @example
 *
 * store.query(getEntityByPredicate(({ title }) => title === 'Elf'))
 *
 */
export function getEntityByPredicate<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options: BaseEntityOptions<Ref> = {}
): Query<S, getEntityType<S, Ref> | undefined> {
  return function (state) {
    const { ref: { entitiesKey, idsKey } = defaultEntitiesRef } = options;
    const entities = state[entitiesKey];
    const id = state[idsKey].find((id: getIdType<S, Ref>) => {
      return predicate(entities[id]);
    });

    return entities[id];
  };
}

/**
 *
 * Get many entities by predicate
 *
 * @example
 *
 * store.query(geManyByPredicate(({ active }) => active))
 * store.query(geManyByPredicate((el: Todo) => el.active, { pluck: 'title' }))
 * store.query(geManyByPredicate((el: Todo) => el.active, { ref: UIEntitiesRef, pluck: 'title' }))
 */
export function getManyByPredicate<
  S extends EntitiesState<Ref>,
  R extends getEntityType<S, Ref>[],
  K extends keyof getEntityType<S, Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options?: {
    pluck?: K | ((entity: getEntityType<S, Ref>) => R);
  } & BaseEntityOptions<Ref>
): Query<S, getEntityType<S, Ref>[]> {
  return function (state) {
    const { ref: { entitiesKey, idsKey } = defaultEntitiesRef, pluck } =
      options || {};
    const filteredEntities: getEntityType<S, Ref>[] = [];

    state[idsKey].forEach((id: getIdType<S, Ref>, index: number) => {
      const entity = state[entitiesKey][id];

      if (predicate(entity, index)) {
        filteredEntities.push(checkPluck(entity, pluck));
      }
    });
    console.log(filteredEntities);

    return filteredEntities;
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

/**
 *
 * Get the entities ids
 *
 * @example
 *
 * store.query(getEntitiesIds())
 *
 */
export function getEntitiesIds<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}): Query<S, getIdType<S, Ref>[]> {
  return function (state) {
    const { ref: { idsKey } = defaultEntitiesRef } = options;

    return state[idsKey];
  };
}
