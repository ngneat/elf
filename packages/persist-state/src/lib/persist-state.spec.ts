import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  addEntities,
  deleteEntities,
  updateEntities,
} from '@ngneat/elf-entities';
import { createEntitiesStore, createTodo } from '@ngneat/elf-mocks';
import { Async, StateStorage } from './storage';
import { persistState } from './persist-state';

describe('persist state', () => {
  global.window = {} as any;

  it('should persist upon update', () => {
    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => of(null)),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };

    const store = createEntitiesStore();
    persistState(store, { storage });
    expect(storage.setItem).not.toHaveBeenCalled();

    store.update(addEntities(createTodo(1)));
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(
      `todos@store`,
      store.getValue(),
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

    store.update(addEntities(createTodo(1)));
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(`todos@store`, {
      ids: [1, 2],
    });
  });

  it('should unsubscribe all calls to getItems', async () => {
    const subscriptions = new Set<number>();
    let getItemSubscriptionNb = 0;
    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => {
        return new Observable(() => {
          const id = ++getItemSubscriptionNb;
          subscriptions.add(id);
          return () => {
            subscriptions.delete(id);
          };
        });
      }),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };
    const store = createEntitiesStore();
    const { unsubscribe } = persistState(store, { storage });

    expect(subscriptions.size).toBeGreaterThan(0);

    unsubscribe();

    expect(subscriptions.size).toBe(0);
  });

  it('should work with class instances', () => {
    class CustomStateStorage implements StateStorage {
      private readonly _storage: Record<string, string> = {};

      getItem<T extends Record<string, any> | string>(
        key: string,
      ): Async<T | undefined | null> {
        const value = this._storage[key];
        return Promise.resolve(value && JSON.parse(value));
      }

      removeItem(key: string): Async<boolean> {
        delete this._storage[key];
        return Promise.resolve(true);
      }

      setItem(key: string, value: Record<string, any>): Async<boolean> {
        this._storage[key] = JSON.stringify(value);
        return Promise.resolve(true);
      }
    }
    const customStateStorage = new CustomStateStorage();
    const store = createEntitiesStore();
    expect(() => {
      persistState(store, { storage: customStateStorage });
      store.update(addEntities(createTodo(1)));
      store.update(updateEntities(1, { title: 'new-title' }));
      store.update(deleteEntities(1));
    }).not.toThrowError(
      new TypeError(`Cannot read properties of undefined (reading '_storage')`),
    );
  });

  it('should call preStoreValueInit and preStoreInit and decode sensitive data and complete before saving to store', () => {
    const value = createTodo(1);
    value.sensitiveData = 'S3cr37';

    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => of(value)),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };

    const preStoreValueInit = jest.fn().mockImplementation((value) => {
      const newValue = { ...value };
      newValue.sensitiveData = 'Secret';
      return newValue;
    });

    const preStoreInit = jest.fn().mockImplementation((value) => {
      const newState = { ...value };
      newState.completed = true;
      return newState;
    });

    const store = createEntitiesStore();
    persistState(store, { storage, preStoreValueInit, preStoreInit });
    expect(preStoreValueInit).toHaveBeenCalledTimes(1);
    expect(preStoreInit).toHaveBeenCalledTimes(1);

    const savedState = store.getValue();
    expect(savedState).toEqual(store.getValue());
    expect(savedState).toHaveProperty('sensitiveData', 'Secret');
    expect(savedState).toHaveProperty('completed', true);
  });

  it('should call preStorageUpdate and encode sensitive data and complete before saving to storage', () => {
    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => of(null)),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };

    const preStorageUpdate = jest
      .fn()
      .mockImplementation((storeName, state) => {
        const newState = { ...state };

        if (storeName === 'todos') {
          newState.entities['1'].completed = true;
        }

        return newState;
      });

    const preStorageValueUpdate = jest
      .fn()
      .mockImplementation((storeName, state) => {
        const newState = { ...state };

        if (storeName === 'todos') {
          newState.entities['1'].sensitiveData = 'S3cr37';
        }

        return newState;
      });

    const store = createEntitiesStore();
    persistState(store, { storage, preStorageUpdate, preStorageValueUpdate });
    expect(preStorageUpdate).not.toHaveBeenCalled();
    expect(preStorageValueUpdate).not.toHaveBeenCalled();

    const todo = createTodo(1);
    todo.sensitiveData = 'Secret';
    store.update(addEntities(todo));
    expect(preStorageUpdate).toHaveBeenCalledTimes(1);
    expect(preStorageUpdate).toHaveBeenCalledWith('todos', store.getValue());
    expect(preStorageValueUpdate).toHaveBeenCalledTimes(1);

    const savedState = store.getValue();
    expect(savedState).toHaveProperty('entities.1.sensitiveData', 'S3cr37');
    expect(savedState).toHaveProperty('entities.1.completed', true);
    expect(storage.setItem).toHaveBeenCalledWith('todos@store', savedState);
  });
});
