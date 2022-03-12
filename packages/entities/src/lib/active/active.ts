import { Observable, OperatorFunction } from 'rxjs';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType,
} from '../entity.state';
import { switchMap } from 'rxjs/operators';
import { propsArrayFactory, propsFactory, Query, StateOf } from '@ngneat/elf';
import { selectEntity } from '../entity.query';
import { selectMany } from '../many.query';

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
): OperatorFunction<S, getEntityType<S, Ref> | undefined> {
  const { ref = defaultEntitiesRef } = options;

  return function (source: Observable<S>) {
    return source
      .pipe(selectActiveId())
      .pipe(switchMap((id) => source.pipe(selectEntity(id, { ref }))));
  };
}

export function getActiveEntity<
  S extends EntitiesState<Ref> & StateOf<typeof withActiveId>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(
  options: BaseEntityOptions<Ref> = {}
): Query<S, getEntityType<S, Ref> | undefined> {
  const { ref: { entitiesKey } = defaultEntitiesRef } = options;

  return function (state: S) {
    return state[entitiesKey][getActiveId(state)];
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

export function getActiveEntities<
  S extends EntitiesState<Ref> & StateOf<typeof withActiveIds>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(options: BaseEntityOptions<Ref> = {}): Query<S, getEntityType<S, Ref>[]> {
  const { ref: { entitiesKey } = defaultEntitiesRef } = options;

  return function (state: S) {
    const result = [];

    for (const id of getActiveIds(state)) {
      const entity = state[entitiesKey][id];
      if (entity) {
        result.push(entity);
      }
    }

    return result;
  };
}
