import { select } from '../core/queries';
import { EntityState, getEntityType } from './entity.state';

export function selectFirst<S extends EntityState>() {
  return select<S, getEntityType<S> | undefined>(state => state.$entities[state.$ids[0]]);
}
