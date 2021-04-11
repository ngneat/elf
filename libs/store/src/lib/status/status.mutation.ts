import { Status, StatusState } from './status.state';
import { Reducer } from '@eleanor/store';

export function setStatus<S extends StatusState>(status: Status): Reducer<S> {
  return function(state: S) {
    return {
      ...state,
      $status: status
    };
  };
}
