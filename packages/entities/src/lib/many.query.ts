import {
  distinctUntilArrayItemChanged,
  isUndefined,
  select,
} from '@ngneat/elf';
import { OperatorFunction, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { untilEntitiesChanges } from './all.query';
import { getEntity } from './entity.query';
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
import { checkPluck } from './entity.utils';

interface Options extends BaseEntityOptions<any> {
  pluck?: string | ((entity: unknown) => any);
}

/**
 * Observe multiple entities
 *
 * @example
 *
 * store.pipe(selectMany([1,2,3], { pluck: 'title' })
 *
 */
export function selectMany<
  S extends EntitiesState<Ref>,
  K extends keyof getEntityType<S, Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  ids: Array<getIdType<S, Ref>>,
  options: { pluck: K } & BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[K][]>;

/**
 * Observe multiple entities
 *
 * @example
 *
 * store.pipe(selectMany([1,2,3], { pluck: e => e.title })
 *
 */
export function selectMany<
  S extends EntitiesState<Ref>,
  R,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  ids: Array<getIdType<S, Ref>>,
  options: {
    pluck: (entity: getEntityType<S, Ref>) => R;
  } & BaseEntityOptions<Ref>
): OperatorFunction<S, R[]>;

/**
 * Observe multiple entities
 *
 * @example
 *
 * store.pipe(selectMany([1, 2, 3])
 *
 */
export function selectMany<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  ids: Array<getIdType<S, Ref>>,
  options?: BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[]>;

export function selectMany<S extends EntitiesState<Ref>, Ref>(
  ids: any[],
  options: Options = {}
): any {
  const { ref: { entitiesKey } = defaultEntitiesRef, pluck } = options;

  return pipe(
    select<S, EntitiesRecord>((state) => state[entitiesKey]),
    map((entities) => {
      if (!ids.length) return [];

      const filtered = [];
      for (const id of ids) {
        const entity = getEntity(entities, id, pluck);
        if (!isUndefined(entity)) filtered.push(entity);
      }

      return filtered;
    }),
    distinctUntilArrayItemChanged()
  );
}

export function selectManyByPredicate<
  S extends EntitiesState<Ref>,
  R extends getEntityType<S, Ref>[],
  K extends keyof getEntityType<S, Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options?: {
    pluck?: K | ((entity: getEntityType<S, Ref>) => R);
  } & BaseEntityOptions<Ref>
): OperatorFunction<S, getEntityType<S, Ref>[]> {
  const { ref: { entitiesKey, idsKey } = defaultEntitiesRef, pluck } =
    options || {};

  return pipe(
    untilEntitiesChanges(entitiesKey),
    select<S, getEntityType<S, Ref>[]>((state) => {
      const filteredEntities: getEntityType<S, Ref>[] = [];

      state[idsKey].forEach((id: getIdType<S, Ref>, index: number) => {
        const entity = state[entitiesKey][id];

        if (predicate(entity, index)) {
          filteredEntities.push(checkPluck(entity, pluck));
        }
      });

      return filteredEntities;
    }),
    distinctUntilArrayItemChanged()
  );
}
