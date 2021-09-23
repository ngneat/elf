import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { addEntities } from '@ngneat/elf-entities';
import { createEntitiesStore, createTodo } from '@ngneat/elf-mocks';
import { StateStorage } from './storage';
import { persistState } from './persist-state';

describe('persist state', () => {
  it('should persist upon update', () => {
    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => of(null)),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };

    const store = createEntitiesStore();
    persistState(store, { storage });
    expect(storage.setItem).not.toHaveBeenCalled();

    store.reduce(addEntities(createTodo(1)));
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(
      `todos@store`,
      store.getValue()
    );
  });

  it('should initialize the store from storage', () => {
    const value = { ids: [1], entities: { 1: { id: 1 } } };

    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => of(value)),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };

    const store = createEntitiesStore();
    const instance = persistState(store, { storage });
    const spy = jest.fn();
    instance.initialized$.subscribe(spy);
    expect(store.getValue()).toEqual(value);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('should allow different source', () => {
    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => of(null)),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };

    const store = createEntitiesStore();
    persistState(store, {
      storage,
      source: (store) => store.pipe(map(() => ({ ids: [1, 2] }))),
    });
    expect(storage.setItem).not.toHaveBeenCalled();

    store.reduce(addEntities(createTodo(1)));
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(`todos@store`, {
      ids: [1, 2],
    });
  });
});
