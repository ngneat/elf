import { stateFactory } from '@ngneat/elf';
import { StatusState } from '../core/types';

export const { withStatus, setStatus, selectStatus, resetStatus } =
  stateFactory<{ status: StatusState }>('status', 'idle');
