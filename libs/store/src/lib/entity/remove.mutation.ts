import { coerceArray } from '../core/utils';
import { EntityState, getIdType } from './entity.state';
import { Reducer } from '@eleanor/store';
import { OrArray } from '../core/types';

export function removeEntity<S extends EntityState>(ids: OrArray<getIdType<S>>): Reducer<S> {
  return function reducer(state: S) {
    const idsToRemove = coerceArray(ids);
    const newEntities = { ...state.$entities };
    const newIds = state.$ids.filter(id => !idsToRemove.includes(id));

    for(const id of idsToRemove) {
      delete newEntities[id];
    }

    return {
      ...state,
      $entities: newEntities,
      $ids: newIds
    };
  };
}

export function removeAll<S extends EntityState>(): Reducer<S> {
  return function reducer(state: S) {
    return {
      ...state,
      $entities: {},
      $ids: []
    };
  };
}
