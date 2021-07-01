import { propsFactory } from '../core/props-factory';
import { StatusState } from '../core/types';

export const { withStatus, setStatus, selectStatus, resetStatus } =
  propsFactory<{ status: StatusState }>('status', 'idle');
