import {
  BaseEntityOptions,
  DefaultEntitiesRef,
  defaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdKey,
} from './entity.state';
import { OrArray } from '../core/types';
import { Reducer, Store } from '../core/store';
import { buildEntities } from './entity.utils';

/**
 *
 * Add entities
 *
 * @example
 *
 * store.reduce(addEntities(entity))
 *
 * store.reduce(addEntities([entity, entity]))
 *
 * store.reduce(addEntities([entity, entity]), { prepend: true })
 *
 */
export function addEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  entities: OrArray<getEntityType<S, Ref>>,
  options: {
    prepend?: boolean;
  } & BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function reducer(state: S, store: Store) {
    const { prepend = false, ref = defaultEntitiesRef } = options;

    const { entitiesKey, idsKey } = ref!;

    const { ids, asObject } = buildEntities<S, Ref>(
      ref as Ref,
      entities,
      getIdKey(store, ref)
    );

    return {
      ...state,
      [entitiesKey]: { ...state[entitiesKey], ...asObject },
      [idsKey]: prepend
        ? [...ids, ...state[idsKey]]
        : [...state[idsKey], ...ids],
    };
  };
}
