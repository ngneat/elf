import { select } from '../core/operators';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRecord,
  EntitiesRef,
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
  S extends EntitiesRecord,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}) {
  const { ref: { entitiesKey, idsKey } = defaultEntitiesRef } = options;

  return select<S, getEntityType<S, Ref> | undefined>(
    (state) => state[entitiesKey][state[idsKey][0]]
  );
}
