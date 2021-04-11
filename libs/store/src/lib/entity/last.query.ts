import { EntityState, getEntityType } from './entity.state';
import { select } from '../core/queries';

export function selectLast<S extends EntityState>() {
  return select<S, getEntityType<S> | undefined>(state => state.$entities[state.$ids[state.$ids.length - 1]]);
}
