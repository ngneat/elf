import { OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdType, ItemPredicate } from './entity.state';
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
export function selectCount<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(options: BaseEntityOptions<Ref>): OperatorFunction<S, number> {
  const { ref: { idsKey } = defaultEntitiesRef } = options;
  return select(state => state[idsKey].length);
}

/**
 * Select the store's entity collection length
 *
 * @example
 *
 * store.pipe(selectCount(entity => entity.completed))
 *
 */
export function selectCountByPredicate<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(predicate: ItemPredicate<getEntityType<S, Ref>>, options: BaseEntityOptions<Ref>): OperatorFunction<S, number> {
  const { ref: { idsKey, entitiesKey } = defaultEntitiesRef } = options;

  return pipe(
    untilEntitiesChanges(entitiesKey),
    map(state => state[idsKey].filter((id: getIdType<S, Ref>) => predicate(state[entitiesKey][id])).length),
    distinctUntilChanged()
  );
}
