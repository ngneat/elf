import {
  deleteAllPages,
  deletePage,
  getPaginationData,
  hasPage,
  selectActivePageEntities,
  selectCurrentPage,
  selectHasPage,
  setCurrentPage,
  setPage,
  skipWhilePageExists,
  updatePaginationData,
  withPagination,
} from './pagination';
import {
  addEntities,
  createState,
  Store,
  updateEntities,
  withEntities,
} from '@ngneat/elf';
import { Subject } from 'rxjs';

describe('withPagination', () => {
  const { state, config } = createState(
    withEntities<{ id: number; name?: string }>(),
    withPagination()
  );

  let store: Store<{
    name: string;
    config: typeof config;
    state: typeof state;
  }>;

  beforeEach(() => {
    store = new Store({ name: '', config, state });
  });

  it('should selectActivePage', () => {
    const spy = jest.fn();

    store.pipe(selectCurrentPage()).subscribe((v) => {
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith(1);

    store.reduce(setCurrentPage(2));

    expect(spy).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should updatePaginationData', () => {
    expect(store.query(getPaginationData())).toStrictEqual({
      currentPage: 1,
      pages: {},
      perPage: 0,
      lastPage: 0,
      total: 0,
    });

    store.reduce(
      updatePaginationData({
        currentPage: 1,
        total: 22,
        perPage: 2,
        lastPage: 2,
      })
    );

    expect(store.query(getPaginationData())).toStrictEqual({
      pages: {},
      currentPage: 1,
      total: 22,
      perPage: 2,
      lastPage: 2,
    });
  });

  it('should setPage/deletePage/deleteAllPages', () => {
    store.reduce(setPage(1, [1, 2]));
    expect(store.query(getPaginationData())).toStrictEqual({
      pages: {
        1: [1, 2],
      },
      currentPage: 1,
      total: 0,
      perPage: 0,
      lastPage: 0,
    });

    store.reduce(setPage(2, [3, 4]));

    expect(store.query(getPaginationData())).toStrictEqual({
      pages: {
        1: [1, 2],
        2: [3, 4],
      },
      currentPage: 1,
      total: 0,
      perPage: 0,
      lastPage: 0,
    });

    store.reduce(deletePage(2));
    expect(store.query(getPaginationData())).toStrictEqual({
      pages: {
        1: [1, 2],
      },
      currentPage: 1,
      total: 0,
      perPage: 0,
      lastPage: 0,
    });

    store.reduce(deleteAllPages());

    expect(store.query(getPaginationData())).toStrictEqual({
      pages: {},
      currentPage: 1,
      total: 0,
      perPage: 0,
      lastPage: 0,
    });
  });

  it('should selectHasPage/hasPage', () => {
    expect(store.query(hasPage(1))).toBeFalsy();

    store.reduce(setPage(1, [1, 2]));
    expect(store.query(hasPage(1))).toBeTruthy();

    const spy = jest.fn();

    store.pipe(selectHasPage(2)).subscribe((v) => {
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith(false);
    store.reduce(setPage(2, [3, 4]));
    expect(spy).toHaveBeenCalledWith(true);

    store.reduce(setPage(3, [5, 6]));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should selectActivePageEntities', () => {
    const spy = jest.fn();

    store.pipe(selectActivePageEntities()).subscribe((v) => {
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith([]);

    store.reduce(addEntities([{ id: 1 }, { id: 2 }]), setPage(1, [1, 2]));

    expect(spy).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);

    store.reduce(addEntities([{ id: 3 }, { id: 4 }]), setPage(2, [3, 4]));

    // Different page should not cause an emission
    expect(spy).toHaveBeenCalledTimes(2);

    store.reduce(setCurrentPage(2));
    expect(spy).toHaveBeenCalledWith([{ id: 3 }, { id: 4 }]);

    store.reduce(updateEntities(3, { name: 'foo' }));
    expect(spy).toHaveBeenCalledWith([{ id: 3, name: 'foo' }, { id: 4 }]);

    store.reduce(deleteAllPages());
    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should skipWhilePageExists', () => {
    let spy = jest.fn();

    const subject = new Subject();

    subject.asObservable().pipe(skipWhilePageExists(store, 1)).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(1);

    store.reduce(setPage(1, [1, 2]));

    spy = jest.fn();

    subject.asObservable().pipe(skipWhilePageExists(store, 1)).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
