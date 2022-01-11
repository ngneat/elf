import { select } from '@ngneat/elf';
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
 * Observe the entities size
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
 * Observe the entities size
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
