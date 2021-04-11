import { coerceArray } from '../core/utils';
import { EntityState, getEntityType, getIdKey, getIdType } from './entity.state';
import { Reducer, Store } from '@eleanor/store';
import { OrArray } from '../core/types';

export function replaceEntity<S extends EntityState>(ids: OrArray<getIdType<S>>, entity: getEntityType<S>): Reducer<S> {
  return function reducer(state: S, store: Store) {
    let updatedEntities: EntityState['$entities'] = {};
    const idKey = getIdKey(store);

    for(const id of coerceArray(ids)) {
      updatedEntities = {
        [id]: {
          [idKey]: id,
          ...entity
        }
      };
    }

    return {
      ...state,
      $entities: { ...state.$entities, ...updatedEntities }
    };
  };
}
