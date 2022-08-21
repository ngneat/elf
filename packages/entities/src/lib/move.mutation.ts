import { Reducer } from '@ngneat/elf';
import {
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
} from '@ngneat/elf-entities';
import { BaseEntityOptions, defaultEntitiesRef } from './entity.state';

/**
 *
 * Move entity
 *
 * @example
 *
 * store.update(moveEntity({ fromIndex: 2, toIndex: 3}))
 *
 */
export function moveEntity<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  options: {
    fromIndex: number;
    toIndex: number;
  } & BaseEntityOptions<Ref>
): Reducer<S> {
  return function (state) {
    const {
      fromIndex,
      toIndex,
      ref: { idsKey, entitiesKey } = defaultEntitiesRef,
    } = options;

    const ids = state[idsKey].slice();
    ids.splice(
      toIndex < 0 ? ids.length + toIndex : toIndex,
      0,
      ids.splice(fromIndex, 1)[0]
    );

    return {
      ...state,
      [entitiesKey]: { ...state[entitiesKey] },
      [idsKey]: ids,
    };
  };
}
