import {DefaultEntitiesRef, getEntityType, getIdType, Reducer, select, selectMany, Store,} from '@ngneat/elf';
import {EMPTY, Observable, OperatorFunction} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {EmptyConfig, State} from '../core/state';
import {EntitiesRef, EntitiesState} from '../entities/entity.state';
import {Query, StateOf} from '../core/types';
import {StoreDef} from "../core/store";

interface PaginationState<IdType extends number | string = number> {
  pagination: {
    activePage: IdType;
    pages: Record<IdType, IdType[]>;
    // perPage: number;
    // lastPage: number;
    // currentPage: "3",
    // total: 150,
  };
}

export function withPagination<IdType extends string | number = number>(options?: {
  initialPage?: IdType;
}): State<PaginationState<IdType>, EmptyConfig> {
  return {
    state: {
      pagination: {
        activePage: options?.initialPage ?? (1 as IdType),
        pages: {} as Record<IdType, IdType[]>,
      },
    },
    config: {},
  };
}

export function setPage<S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef>(id: getIdType<S, Ref>, ids: Array<getIdType<S, Ref>>): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        pages: {
          ...state.pagination.pages,
          [id]: ids,
        },
      },
    };
  };
}

export function deletePage<S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef>(id: getIdType<S, Ref>): Reducer<S> {
  return function (state: S) {
    const pages = {...state.pagination.pages};
    Reflect.deleteProperty(pages, id);

    return {
      ...state,
      pagination: {
        ...state.pagination,
        pages,
      },
    };
  };
}

export function deleteAllPages<S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef>(): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        pages: {},
      },
    };
  };
}

export function setActivePage<S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>>(id: S['pagination']['activePage']): Reducer<S> {
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

export function selectActivePage<S extends StateOf<typeof withPagination>>(): OperatorFunction<S, S['pagination']['activePage']> {
  return select((state) => state.pagination.activePage);
}

export function selectHasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['activePage']
): OperatorFunction<S, boolean> {
  return select((state) => Reflect.has(state.pagination.pages, id));
}

export function hasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['activePage']
): Query<S, boolean> {
  return function (state: S) {
    return Reflect.has(state.pagination.pages, id);
  };
}

export function selectActivePageEntities<S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>,
  Ref extends EntitiesRef = DefaultEntitiesRef>(): OperatorFunction<S, Array<getEntityType<S, Ref>>> {
  return function (source: Observable<S>) {
    return source.pipe(selectActivePage()).pipe(
      switchMap((page) => {
        return source
          .pipe(select((state) => state.pagination.pages[page]))
          .pipe(switchMap((ids) => source.pipe(selectMany(ids ?? []))));
      })
    );
  };
}


export function skipWhilePageExists<T, S extends StateOf<typeof withPagination>>(
  store: Store<StoreDef<S>>,
  key: string | number,
  options?: { returnSource?: Observable<any> }
) {
  return function (source: Observable<T>) {
    if (store.query(hasPage(key))) {
      return options?.returnSource ?? EMPTY;
    }

    return source;
  };
}

