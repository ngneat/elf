import { select } from '../core/operators';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
} from './entity.state';

/**
 *
 * Select the first entity
 *
 * store.pipe(selectFirst())
 *
 */
export function selectFirst<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}) {
  const { ref: { entitiesKey, idsKey } = defaultEntitiesRef } = options;

  return select<S, getEntityType<S, Ref> | undefined>(
    (state) => state[entitiesKey][state[idsKey][0]]
  );
}
