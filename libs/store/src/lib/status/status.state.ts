import { EmptyConfig, State } from '../core/state';

export type Status = 'idle' | 'pending' | 'success' | 'error';

export type StatusState = {
  $status: Status
}

export function withStatus(): State<StatusState, EmptyConfig> {
  return {
    state: {
      $status: 'idle'
    },
    config: {}
  };
}
