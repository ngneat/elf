import { select } from '../core/queries';
import { Status, StatusState } from './status.state';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';

export function selectStatus<S extends StatusState>() {
  return select<S, Status>(state => state.$status);
}

export function selectLoading() {
  return pipe(
    selectStatus(),
    map(status => status === 'pending')
  );
}
