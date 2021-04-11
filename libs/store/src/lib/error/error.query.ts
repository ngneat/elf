import { select } from '../core/queries';
import { ErrorState } from './error.state';

export function selectError<S extends ErrorState>() {
  return select<S, S['$error']>(state => state.$error);
}
