import { stateFactory } from '../core/state-factory';
import { StatusState } from '../core/types';

export const { withStatus, setStatus, selectStatus, resetStatus } =
  stateFactory<{ status: StatusState }>('status', 'idle');
