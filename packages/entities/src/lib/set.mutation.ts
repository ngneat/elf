import {
  BaseEntityOptions,
  DefaultEntitiesRef,
  defaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
  getIdKey,
  getIdType,
} from './entity.state';
import { Reducer, OrArray } from '@ngneat/elf';
import { buildEntities } from './entity.utils';

/**
 *
 * Set entities
 *
 * @example
 *
 * store.update(setEntities([entity, entity]))
 *
 */
export function setEntities<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  entities: OrArray<getEntityType<S, Ref>>,
  options: BaseEntityOptions<Ref> = {}
): Reducer<S> {
  return function (state, context) {
    const { ref = defaultEntitiesRef } = options;
    const { entitiesKey, idsKey } = ref!;
    const { ids, asObject } = buildEntities<S, Ref>(
      entities,
      getIdKey<getIdType<S, Ref>>(context, ref)
    );

    return {
      ...state,
      [entitiesKey]: asObject,
      [idsKey]: ids,
    };
  };
}
