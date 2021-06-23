import { stateFactory } from '../core/state-factory';
import { Observable, OperatorFunction } from 'rxjs';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
} from '../entities/entity.state';
import { selectEntity } from '../entities';
import { switchMap } from 'rxjs/operators';
import { StateOf } from '../core/types';

export const { selectActiveId, setActiveId, withActiveId, resetActiveId } =
  stateFactory<{ activeId: number | undefined }>('activeId', undefined);

export function selectActiveEntity<
  S extends EntitiesState<Ref> & StateOf<typeof withActiveId>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  options: BaseEntityOptions<Ref> = {}
): OperatorFunction<S, getEntityType<S, Ref>> {
  const { ref = defaultEntitiesRef } = options;

  return function (source: Observable<S>) {
    return source
      .pipe(selectActiveId())
      .pipe(switchMap((id) => source.pipe(selectEntity(id, { ref }))));
  };
}
