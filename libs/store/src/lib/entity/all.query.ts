import { EntityState, getEntityType } from './entity.state';
import { MonoTypeOperatorFunction, OperatorFunction, pipe } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function untilEntitiesChanges<T extends EntityState>(): MonoTypeOperatorFunction<T> {
  return distinctUntilChanged(
    (prev, current) => prev.$entities === current.$entities
  );
}

export function selectAll<S extends EntityState>(): OperatorFunction<S, getEntityType<S>[]> {
  return pipe(
    untilEntitiesChanges(),
    map(state => state.$ids.map((id) => state.$entities[id]))
  );
}
