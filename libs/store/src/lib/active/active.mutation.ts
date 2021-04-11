import { ActiveState, getActiveSingleType, getActiveType } from './active.state';
import { Reducer } from '@eleanor/store';
import { coerceArray } from '../core/utils';

export function setActive<S extends ActiveState>(activeIds: getActiveType<S> | getActiveSingleType<S>): Reducer<S> {
  return function(state: S) {
    return {
      ...state,
      $active: coerceArray(activeIds)
    };
  };
}
