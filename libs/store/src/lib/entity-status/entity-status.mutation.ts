import { Reducer } from '@eleanor/store';
import { EntityStatusState, getEntityStatusType } from './entity-status.state';
import { Status } from '../status/status.state';

export function setEntityStatus<S extends EntityStatusState>(id: getEntityStatusType<S>, status: Status = 'pending'): Reducer<S> {
  return state => {
    return {
      ...state,
      $entitiesStatus: {
        ...state.$entitiesStatus,
        [id]: status
      }
    };
  };
}
