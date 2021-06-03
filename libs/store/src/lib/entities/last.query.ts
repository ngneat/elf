import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRecord,
  EntitiesRef,
  getEntityType,
} from './entity.state';
import { select } from '../core/queries';

export function selectLast<
  S extends EntitiesRecord,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}) {
  const { ref: { entitiesKey, idsKey } = defaultEntitiesRef } = options;

  return select<S, getEntityType<S, Ref> | undefined>(
    (state) => state[entitiesKey][state[idsKey][state[idsKey].length - 1]]
  );
}
