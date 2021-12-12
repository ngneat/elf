import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
} from './entity.state';
import { select } from '@ngneat/elf';

/**
 *
 * Observe the last entity
 *
 * @example
 *
 * store.pipe(selectLast())
 *
 */
export function selectLast<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}) {
  const { ref: { entitiesKey, idsKey } = defaultEntitiesRef } = options;

  return select<S, getEntityType<S, Ref> | undefined>(
    (state) => state[entitiesKey][state[idsKey][state[idsKey].length - 1]]
  );
}
