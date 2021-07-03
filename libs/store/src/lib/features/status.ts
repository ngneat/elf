import { propsFactory } from '../core/props-factory';

export type StatusState = 'idle' | 'pending' | 'success' | 'error';

export const { withStatus, setStatus, selectStatus, resetStatus } =
  propsFactory<{ status: StatusState }>('status', 'idle');
