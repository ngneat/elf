import {stateFactory} from '../core/state-factory';
import {Observable, OperatorFunction} from 'rxjs';
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  DefaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  getEntityType, getIdType,
} from '../entities/entity.state';
import {selectEntity, selectMany} from '../entities';
import {switchMap} from 'rxjs/operators';
import {StateOf} from '../core/types';
import {stateArrayFactory} from "../core/state-array-factory";
import {Reducer} from "@ngneat/elf";

export const {selectActiveId, setActiveId, withActiveId, resetActiveId} =
  stateFactory<{ activeId: number | undefined }>('activeId', undefined);

// export function setActivetest<S extends EntitiesState<Ref> & StateOf<typeof withActiveId>, Ref extends EntitiesRef = DefaultEntitiesRef>(
//   ids: getIdType<S, Ref>
// ): Reducer<S> {
//   return function (state: S) {
//     return state;
//   }
// }

export function selectActiveEntity<S extends EntitiesState<Ref> & StateOf<typeof withActiveId>,
  Ref extends EntitiesRef = DefaultEntitiesRef>(
  options: BaseEntityOptions<Ref> = {}
): OperatorFunction<S, getEntityType<S, Ref>> {
  const {ref = defaultEntitiesRef} = options;

  return function (source: Observable<S>) {
    return source
      .pipe(selectActiveId())
      .pipe(switchMap((id) => source.pipe(selectEntity(id, {ref}))));
  };
}


export const {
  setActiveIds,
  resetActiveIds,
  withActiveIds,
  selectActiveIds,
  toggleActiveIds,
  removeActiveIds,
  addActiveIds
} =
  stateArrayFactory<{ activeIds: number[] }>('activeIds', []);

export function selectActiveEntities<S extends EntitiesState<Ref> & StateOf<typeof withActiveIds>,
  Ref extends EntitiesRef = DefaultEntitiesRef>(
  options: BaseEntityOptions<Ref> = {}
): OperatorFunction<S, getEntityType<S, Ref>> {
  const {ref = defaultEntitiesRef} = options;

  return function (source: Observable<S>) {
    return source
      .pipe(selectActiveIds())
      .pipe(switchMap((ids) => source.pipe(selectMany(ids, {ref}))));
  };
}
