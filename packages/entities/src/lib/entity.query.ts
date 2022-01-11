import { isUndefined, select } from '@ngneat/elf';
import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { untilEntitiesChanges } from './all.query';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRecord,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdType,
  ItemPredicate,
} from './entity.state';
import { checkPluck, findEntityByPredicate } from './entity.utils';

interface Options extends BaseEntityOptions<any> {
  pluck?: string | ((entity: unknown) => any);
}

/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntity(id, { pluck: 'title' })
 *
 * store.pipe(selectEntity(id, { ref: UIEntitiesRef })
 *
 */
export function selectEntity<
  S extends EntitiesState<Ref>,
  K extends keyof getEntityType<S, Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,
  options: { pluck: K } & BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[K] | undefined>;

/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntity(id, { pluck: e => e.title })
 *
 * store.pipe(selectEntity(id, { ref: UIEntitiesRef })
 *
 */
export function selectEntity<
  S extends EntitiesState<Ref>,
  R,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,
  options: {
    pluck: (entity: getEntityType<S, Ref>) => R;
  } & BaseEntityOptions<Ref>
): OperatorFunction<S, R | undefined>;

/**
 *
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntity(id))
 *
 * store.pipe(selectEntity(id, { ref: UIEntitiesRef })
 *
 */
export function selectEntity<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  id: getIdType<S, Ref>,
  options?: BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref> | undefined>;

export function selectEntity<S extends EntitiesState<Ref>, Ref>(
  id: any,
  options: Options = {}
) {
  const { ref: { entitiesKey } = defaultEntitiesRef, pluck } = options;

  return pipe(
    untilEntitiesChanges(entitiesKey),
    select<S, Ref>((state) => getEntity(state[entitiesKey], id, pluck))
  );
}

export function getEntity(
  entities: EntitiesRecord,
  id: string | number,
  pluck: Options['pluck']
) {
  const entity = entities[id];

  if (isUndefined(entity)) {
    return undefined;
  }

  if (!pluck) {
    return entity;
  }

  return checkPluck(entity, pluck);
}

/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntityByPredicate(entity => entity.title, { pluck: 'title' })
 *
 * store.pipe(selectEntityByPredicate(entity => entity.title, { ref: UIEntitiesRef })
 *
 */
export function selectEntityByPredicate<
  K extends keyof getEntityType<S, Ref>,
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options?: { pluck?: K } & BaseEntityOptions<Ref> & IdKey
): OperatorFunction<S, getEntityType<S, Ref> | undefined>;

/**
 * Observe an entity
 *
 * @example
 *
 * store.pipe(selectEntityByPredicate(entity => entity.title, { pluck: entity => entity.title })
 *
 * store.pipe(selectEntity(entity => entity.title, { ref: UIEntitiesRef })
 *
 */
export function selectEntityByPredicate<
  R,
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options?: {
    pluck?: (entity: getEntityType<S, Ref>) => R;
  } & BaseEntityOptions<Ref> &
    IdKey
): OperatorFunction<S, getEntityType<S, Ref> | undefined>;

export function selectEntityByPredicate<
  R extends getEntityType<S, Ref>[],
  K extends keyof getEntityType<S, Ref>,
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options?: {
    pluck?: K | ((entity: getEntityType<S, Ref>) => R);
  } & BaseEntityOptions<Ref> &
    IdKey
): OperatorFunction<S, getEntityType<S, Ref> | undefined> {
  const { ref = defaultEntitiesRef, pluck, idKey = 'id' } = options || {};
  const { entitiesKey } = ref;

  let id: getIdType<S, Ref>;
  return pipe(
    select<S, Ref>((state) => {
      if (isUndefined(id)) {
        const entity = findEntityByPredicate(state, ref, predicate);
        id = entity && entity[idKey];
      }
      return state[entitiesKey][id];
    }),
    map((entity) => (entity ? checkPluck(entity, pluck) : undefined)),
    distinctUntilChanged()
  );
}

interface IdKey {
  idKey?: string;
}
