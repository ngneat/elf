import { BaseEntityOptions, DefaultEntitiesRef, defaultEntitiesRef, EntitiesRecord, EntitiesRef, getEntityType, getIdKey, getIdType } from './entity.state';
import { coerceArray } from '../core/utils';
import { OrArray } from '../core/types';
import { Reducer, Store } from '../core/store';

/**
 *
 * Add entities to the store
 *
 * store.reduce(addEntity(entity))
 *
 * store.reduce(addEntity([entity, entity]))
 *
 * store.reduce(addEntity([entity, entity]), { overwrite: true })
 *
 * store.reduce(addEntity([entity, entity]), { prepend: true })
 */
export function addEntity<S extends EntitiesRecord, Ref extends EntitiesRef = DefaultEntitiesRef>(
  entities: OrArray<getEntityType<S, Ref>>,
  options: {
    prepend?: boolean;
    overwrite?: boolean;
  } & BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function reducer(state: S, store: Store) {
    const { overwrite = false, prepend = false, ref = defaultEntitiesRef } = options;

    const { entitiesKey, idsKey } = ref!;

    const toObject = {} as Record<getIdType<S, Ref>, getEntityType<S, Ref>>;
    const ids = [] as getIdType<S, Ref>;
    const idKey = getIdKey<getIdType<S, Ref>>(store);

    for(const entity of coerceArray(entities)) {
      const id = entity[idKey];
      if(!overwrite && id in state[entitiesKey]) continue;

      ids.push(id);
      toObject[id] = entity;
    }

    if(!ids.length) return state;

    return {
      ...state,
      [entitiesKey]: overwrite ? toObject : { ...state[entitiesKey], ...toObject },
      [idsKey]: overwrite ? ids : prepend ? [...ids, ...state[idsKey]] : [...state[idsKey], ...ids]
    };
  };
}
