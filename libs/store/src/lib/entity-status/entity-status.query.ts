import { select } from '../core/queries';
import { isUndefined } from '../core/utils';
import { OperatorFunction } from 'rxjs';
import { EntityStatusState, getEntityStatusType } from './entity-status.state';
import { Status } from '../status/status.state';

export function selectEntityStatus<S extends EntityStatusState>(id: getEntityStatusType<S>): OperatorFunction<S, Status>;
export function selectEntityStatus<S extends EntityStatusState>(): OperatorFunction<S, S['$entitiesStatus']>;
export function selectEntityStatus<S extends EntityStatusState>(id?: any): any {
  return select<S, any>(state => {
    return isUndefined(id) ? state.$entitiesStatus : state.$entitiesStatus[id];
  });
}
