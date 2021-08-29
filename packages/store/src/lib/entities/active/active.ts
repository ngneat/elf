import { propsFactory } from '../../core/props-factory';
import { Observable, OperatorFunction } from 'rxjs';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
} from '../entity.state';
import { selectEntity, selectMany } from '../index';
import { switchMap } from 'rxjs/operators';
import { StateOf } from '../../core/types';
import { propsArrayFactory } from '../../core/props-array-factory';

export const {
  selectActiveId,
  setActiveId,
  withActiveId,
  resetActiveId,
  getActiveId,
} = propsFactory('activeId', { initialValue: undefined as any });

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

export const {
  setActiveIds,
  resetActiveIds,
  withActiveIds,
  selectActiveIds,
  toggleActiveIds,
  removeActiveIds,
  addActiveIds,
  getActiveIds,
} = propsArrayFactory('activeIds', { initialValue: [] as any[] });

export function selectActiveEntities<
  S extends EntitiesState<Ref> & StateOf<typeof withActiveIds>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  options: BaseEntityOptions<Ref> = {}
): OperatorFunction<S, getEntityType<S, Ref>[]> {
  const { ref = defaultEntitiesRef } = options;

  return function (source: Observable<S>) {
    return source
      .pipe(selectActiveIds())
      .pipe(switchMap((ids) => source.pipe(selectMany(ids, { ref }))));
  };
}
