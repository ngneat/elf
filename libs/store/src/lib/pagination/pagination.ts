import {
  DefaultEntitiesRef,
  getEntityType,
  getIdType,
  Reducer,
  select,
  selectMany,
} from '@ngneat/elf';
import { Observable, OperatorFunction } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { EmptyConfig, State } from '../core/state';
import { EntitiesRef, EntitiesState } from '../entities/entity.state';
import { Query, StateOf } from '../core/types';

interface PaginationState<IdType extends number | string = number> {
  pagination: {
    activePage: IdType;
    value: Record<IdType, IdType[]>;
  };
}

export function withPagination<
  IdType extends string | number = number
>(): State<PaginationState<IdType>, EmptyConfig> {
  return {
    state: {
      pagination: {
        activePage: 0 as IdType,
        value: {} as Record<IdType, IdType[]>,
      },
    },
    config: {},
  };
}

export function setPage<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(id: getIdType<S, Ref>, ids: Array<getIdType<S, Ref>>): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        value: {
          ...state.pagination.value,
          [id]: ids,
        },
      },
    };
  };
}

export function deletePage<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(id: getIdType<S, Ref>): Reducer<S> {
  return function (state: S) {
    const value = { ...state.pagination.value };
    Reflect.deleteProperty(value, id);

    return {
      ...state,
      pagination: {
        ...state.pagination,
        value,
      },
    };
  };
}

export function deleteAllPages<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        value: {},
      },
    };
  };
}

export function setActivePage<
  S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>
>(id: S['pagination']['activePage']): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        activePage: id,
      },
    };
  };
}

export function selectActivePage<
  S extends StateOf<typeof withPagination>
>(): OperatorFunction<S, S['pagination']['activePage']> {
  return select((state) => state.pagination.activePage);
}

export function selectHasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['activePage']
): OperatorFunction<S, boolean> {
  return select((state) => Reflect.has(state.pagination.value, id));
}

export function hasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['activePage']
): Query<S, boolean> {
  return function (state: S) {
    return Reflect.has(state.pagination.value, id);
  };
}

export function selectActivePageEntities<
  S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(): OperatorFunction<S, Array<getEntityType<S, Ref>>> {
  return function (source: Observable<S>) {
    return source.pipe(
      selectActivePage(),
      withLatestFrom(source.pipe(select((state) => state.pagination.value))),
      switchMap(([activePage, pages]) => {
        return source.pipe(selectMany(pages[activePage]));
      })
    );
  };
}
