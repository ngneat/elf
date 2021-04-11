import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { EntityState, getEntityType, ItemPredicate } from './entity.state';
import { untilEntitiesChanges } from './all.query';
import { select } from '../core/queries';

/**
 * Select the store's entity collection length
 *
 * @example
 *
 * store.pipe(selectCount())
 *
 */
export function selectCount<T extends EntityState>(): OperatorFunction<T, number> {
  return select(state => state.$ids.length);
}

/**
 * Select the store's entity collection length
 *
 * @example
 *
 * store.pipe(selectCount(entity => entity.completed))
 *
 */
export function selectCountByPredicate<T extends EntityState>(predicate: ItemPredicate<getEntityType<T>>): OperatorFunction<T, number> {
  return pipe(
    untilEntitiesChanges(),
    map(state => state.$ids.filter((id) => predicate(state.$entities[id])).length),
    distinctUntilChanged()
  );
}
