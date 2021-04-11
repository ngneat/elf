import { EmptyConfig, State } from '../core/state';

export type getActiveType<S> = S extends ActiveState ? S['$active'] : never;
export type getActiveSingleType<S> = S extends ActiveState ? S['$active'] extends Array<infer U> ? U : never : never;
export type ActiveState<IdKey = any> = { $active: IdKey[] };

export function withActive<IdKey>(): State<ActiveState<IdKey>, EmptyConfig> {
  return {
    state: {
      $active: []
    },
    config: {}
  };
}
