import {
  deleteAllPages,
  deletePage,
  getPaginationData,
  hasPage,
  selectCurrentPageEntities,
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
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { createState, Store } from '@ngneat/elf';
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

    store.update(setCurrentPage(2));

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

    store.update(
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
    store.update(setPage(1, [1, 2]));
    expect(store.query(getPaginationData())).toStrictEqual({
      pages: {
        1: [1, 2],
      },
      currentPage: 1,
      total: 0,
      perPage: 0,
      lastPage: 0,
    });

    store.update(setPage(2, [3, 4]));

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

    store.update(deletePage(2));
    expect(store.query(getPaginationData())).toStrictEqual({
      pages: {
        1: [1, 2],
      },
      currentPage: 1,
      total: 0,
      perPage: 0,
      lastPage: 0,
    });

    store.update(deleteAllPages());

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

    store.update(setPage(1, [1, 2]));
    expect(store.query(hasPage(1))).toBeTruthy();

    const spy = jest.fn();

    store.pipe(selectHasPage(2)).subscribe((v) => {
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith(false);
    store.update(setPage(2, [3, 4]));
    expect(spy).toHaveBeenCalledWith(true);

    store.update(setPage(3, [5, 6]));
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('should selectCurrentPageEntities', () => {
    const spy = jest.fn();

    store.pipe(selectCurrentPageEntities()).subscribe((v) => {
      spy(v);
    });

    expect(spy).toHaveBeenCalledWith([]);

    store.update(addEntities([{ id: 1 }, { id: 2 }]), setPage(1, [1, 2]));

    expect(spy).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);

    store.update(addEntities([{ id: 3 }, { id: 4 }]), setPage(2, [3, 4]));

    // Different page should not cause an emission
    expect(spy).toHaveBeenCalledTimes(2);

    store.update(setCurrentPage(2));
    expect(spy).toHaveBeenCalledWith([{ id: 3 }, { id: 4 }]);

    store.update(updateEntities(3, { name: 'foo' }));
    expect(spy).toHaveBeenCalledWith([{ id: 3, name: 'foo' }, { id: 4 }]);

    store.update(deleteAllPages());
    expect(spy).toHaveBeenCalledWith([]);
  });

  it('should skipWhilePageExists', () => {
    let spy = jest.fn();

    const subject = new Subject();

    subject.asObservable().pipe(skipWhilePageExists(store, 1)).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(1);

    store.update(setPage(1, [1, 2]));

    spy = jest.fn();

    subject.asObservable().pipe(skipWhilePageExists(store, 1)).subscribe(spy);

    subject.next({});
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
