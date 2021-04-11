import { ActiveState } from './active.state';
import { select } from '../core/queries';

export function selectActive<S extends ActiveState>() {
  return select<S, S['$active']>(state => state.$active);
}
