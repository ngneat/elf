import { select } from '../core/queries';
import { BaseEntityOptions, defaultEntitiesRef, DefaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType } from './entity.state';

export function selectFirst<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(options: BaseEntityOptions<Ref> = {}) {
  const { ref = defaultEntitiesRef } = options;
  return select<S, getEntityType<S, Ref> | undefined>(state => state[ref.entitiesKey][state[ref.idsKey][0]]);
}
