import { EMPTY, Observable, OperatorFunction } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  EntitiesRef,
  EntitiesState,
  getEntityType,
  DefaultEntitiesRef,
  selectMany,
  getIdType,
} from '@ngneat/elf-entities';
import {
  EmptyConfig,
  Query,
  Reducer,
  select,
  PropsFactory,
  StateOf,
  Store,
  StoreDef,
} from '@ngneat/elf';

export interface PaginationData<IdType extends number | string = number> {
  total: number;
  perPage: number;
  lastPage: number;
  currentPage: IdType;
}

interface PaginationState<IdType extends number | string = number> {
  pagination: {
    pages: Record<IdType, IdType[]>;
  } & PaginationData<IdType>;
}

export function withPagination<
  IdType extends number | string = number
>(options?: {
  initialPage?: IdType;
}): PropsFactory<PaginationState<IdType>, EmptyConfig> {
  return {
    props: {
      pagination: {
        currentPage: options?.initialPage ?? (1 as IdType),
        pages: {} as Record<IdType, IdType[]>,
        perPage: 0,
        lastPage: 0,
        total: 0,
      },
    },
    config: undefined,
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

export function selectPaginationData<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(): OperatorFunction<S, PaginationState['pagination']> {
  return select(getPaginationData<S, Ref>());
}

export function getPaginationData<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(): Query<S, PaginationState['pagination']> {
  return function (state: S) {
    return state.pagination as PaginationState['pagination'];
  };
}

export function updatePaginationData<
  S extends StateOf<typeof withPagination> & EntitiesState<Ref>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(data: PaginationData): Reducer<S> {
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

export function setCurrentPage<
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

export function selectCurrentPage<
  S extends StateOf<typeof withPagination>
>(): OperatorFunction<S, S['pagination']['currentPage']> {
  return select((state) => state.pagination.currentPage);
}

export function selectHasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['currentPage']
): OperatorFunction<S, boolean> {
  return select(hasPage<S>(id));
}

export function hasPage<S extends StateOf<typeof withPagination>>(
  id: S['pagination']['currentPage']
): Query<S, boolean> {
  return function (state: S) {
    return Reflect.has(state.pagination.pages, id);
  };
}

export function selectCurrentPageEntities<
  S extends StateOf<typeof withPagination> & EntitiesState<DefaultEntitiesRef>,
  Ref extends EntitiesRef = DefaultEntitiesRef
>(): OperatorFunction<S, Array<getEntityType<S, Ref>>> {
  return function (source: Observable<S>) {
    return source.pipe(selectCurrentPage()).pipe(
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
  page: string | number,
  options?: { returnSource?: Observable<any> }
) {
  return function (source: Observable<T>) {
    if (store.query(hasPage(page))) {
      return options?.returnSource ?? EMPTY;
    }

    return source;
  };
}
