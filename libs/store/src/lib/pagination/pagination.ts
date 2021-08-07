import {
  DefaultEntitiesRef,
  getEntityType,
  getIdType,
  Reducer,
  select,
  selectMany,
  Store,
} from '@ngneat/elf';
import { EMPTY, Observable, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EmptyConfig, State } from '../core/state';
import { EntitiesRef, EntitiesState } from '../entities/entity.state';
import { Query, StateOf } from '../core/types';
import { StoreDef } from '../core/store';

export interface PaginationResponse<Entity> {
  data: Entity[];
  perPage: number;
  lastPage: number;
  total: number;
  currentPage: number;
}

interface PaginationState<IdType extends number | string = number> {
  pagination: {
    currentPage: IdType;
    pages: Record<IdType, IdType[]>;
    perPage: number;
    lastPage: number;
    total: number;
  };
}

export function withPagination<
  IdType extends string | number = number
>(options?: {
  initialPage?: IdType;
}): State<PaginationState<IdType>, EmptyConfig> {
  return {
    state: {
      pagination: {
        currentPage: options?.initialPage ?? (1 as IdType),
        pages: {} as Record<IdType, IdType[]>,
        perPage: 0,
        lastPage: 0,
        total: 0,
      },
    },
    config: {},
  };
}

export function setPage<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(key: getIdType<S, Ref>, ids: Array<getIdType<S, Ref>>): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        pages: {
          ...state.pagination.pages,
          [key]: ids,
        },
      },
    };
  };
}

export function setPagination<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(data: Omit<PaginationResponse<getEntityType<S, Ref>>, 'data'>): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        ...data,
      },
    };
  };
}

export function deletePage<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(id: getIdType<S, Ref>): Reducer<S> {
  return function (state: S) {
    const pages = { ...state.pagination.pages };
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

export function deleteAllPages<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(): Reducer<S> {
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

export function setActivePage<
  S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>
>(id: S['pagination']['currentPage']): Reducer<S> {
  return function (state: S) {
    return {
      ...state,
      pagination: {
        ...state.pagination,
        currentPage: id,
      },
    };
  };
}

export function selectActivePage<
  S extends StateOf<typeof withPagination>
>(): OperatorFunction<S, S['pagination']['currentPage']> {
  return select((state) => state.pagination.currentPage);
}

export function selectHasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['currentPage']
): OperatorFunction<S, boolean> {
  return select((state) => Reflect.has(state.pagination.pages, id));
}

export function hasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['currentPage']
): Query<S, boolean> {
  return function (state: S) {
    return Reflect.has(state.pagination.pages, id);
  };
}

export function selectActivePageEntities<
  S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(): OperatorFunction<S, Array<getEntityType<S, Ref>>> {
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

export function skipWhilePageExists<
  T,
  S extends StateOf<typeof withPagination>
>(
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
