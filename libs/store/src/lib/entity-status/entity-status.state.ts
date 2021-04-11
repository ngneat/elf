import { EmptyConfig, State } from '../core/state';
import { Status } from '../status/status.state';

export type EntityStatusState<IdType extends PropertyKey = any> = {
  $entitiesStatus: Record<IdType, Status>;
}

export type getEntityStatusType<S> = S extends EntityStatusState<infer I> ? I : never;

export function withEntityStatus<IdType extends PropertyKey>(): State<EntityStatusState<IdType>, EmptyConfig> {
  return {
    state: {
      $entitiesStatus: {} as EntityStatusState<IdType>['$entitiesStatus']
    },
    config: {}
  };
}
