import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRecord,
  EntitiesRef,
  getEntityType,
  ItemPredicate,
} from './entity.state';
import { untilEntitiesChanges } from './all.query';
import { select } from '../core/operators';
import { findIdsByPredicate } from './entity.utils';

/**
 *
 * Select the store's entity collection length
 *
 * @example
 *
 * store.pipe(selectEntitiesCount())
 *
 */
export function selectEntitiesCount<
  S extends EntitiesRecord,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}): OperatorFunction<S, number> {
  const { ref: { idsKey } = defaultEntitiesRef } = options;

  return select((state) => state[idsKey].length);
}

/**
 *
 * Select the store's entity collection length
 *
 * @example
 *
 * store.pipe(selectEntitiesCountByPredicate(entity => entity.completed))
 *
 */
export function selectEntitiesCountByPredicate<
  S extends EntitiesRecord,
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
