import { Query, select } from '@ngneat/elf';
import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { untilEntitiesChanges } from './all.query';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  ItemPredicate,
} from './entity.state';
import { findIdsByPredicate } from './entity.utils';

/**
 *
 * Observe the entities collection size
 *
 * @example
 *
 * store.pipe(selectEntitiesCount())
 *
 */
export function selectEntitiesCount<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}): OperatorFunction<S, number> {
  const { ref: { idsKey } = defaultEntitiesRef } = options;

  return select((state) => state[idsKey].length);
}

/**
 *
 * Observe the entities collection size  that pass the predicate
 *
 * @example
 *
 * store.pipe(selectEntitiesCountByPredicate(entity => entity.completed))
 *
 */
export function selectEntitiesCountByPredicate<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options: BaseEntityOptions<Ref> = {}
): OperatorFunction<S, number> {
  const ref = options.ref || (defaultEntitiesRef as Ref);

  return pipe(
    untilEntitiesChanges(ref.entitiesKey),
    map((state) => findIdsByPredicate(state, ref, predicate).length),
    distinctUntilChanged()
  );
}

/**
 *
 * Return the entities collection size
 *
 * @example
 *
 * store.query(getEntitiesCount())
 *
 */
export function getEntitiesCount<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}): Query<S, number> {
  return function (state) {
    const { ref: { idsKey } = defaultEntitiesRef } = options;

    return state[idsKey].length;
  };
}

/**
 *
 * Return the entities collection size that pass the predicate
 *
 * @example
 *
 * store.query(getEntitiesCountByPredicate(entity => entity.completed))
 *
 */
export function getEntitiesCountByPredicate<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  predicate: ItemPredicate<getEntityType<S, Ref>>,
  options: BaseEntityOptions<Ref> = {}
): Query<S, number> {
  return function (state) {
    const ref = options.ref || (defaultEntitiesRef as Ref);

    return findIdsByPredicate(state, ref, predicate).length;
  };
}
