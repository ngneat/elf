import { EntityState, getEntityType, getIdKey } from './entity.state';
import { Reducer, Store } from '@eleanor/store';
import { coerceArray } from '../core/utils';
import { OrArray } from '../core/types';

interface Options {
  prepend: boolean;
  overwrite: boolean;
}

export function addEntity<S extends EntityState>(entities: OrArray<getEntityType<S>>, options?: Partial<Options>): Reducer<S> {
  return function reducer(state: S, store: Store) {
    const { overwrite, prepend } = { overwrite: false, prepend: false, ...options } as Options;

    const toObject: EntityState['$entities'] = {};
    const ids: EntityState['$ids'] = [];
    const idKey = getIdKey(store);

    for(const entity of coerceArray(entities)) {
      const id = entity[idKey];
      if(!overwrite && id in state.$entities) continue;

      ids.push(id);
      toObject[id] = entity;
    }

    if(!ids.length) return state;

    return {
      ...state,
      $entities: overwrite ? toObject : { ...state.$entities, ...toObject },
      $ids: overwrite ? ids : prepend ? [...ids, ...state.$ids] : [...state.$ids, ...ids]
    };
  };
}
