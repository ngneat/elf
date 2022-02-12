import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  toMatchSnapshot,
} from '@ngneat/elf-mocks';
import { setEntities, setEntitiesMap } from './set.mutation';
import { UIEntitiesRef } from './entity.state';

describe('set', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should set entities', () => {
    store.update(setEntities([createTodo(1)]));
    toMatchSnapshot(expect, store, 'set one');

    store.update(setEntities([createTodo(2)]));
    toMatchSnapshot(expect, store, 'set one');
  });

  it('should set entities in key-value structure', () => {
    store.update(
      setEntitiesMap({
        1: createTodo(1),
      })
    );
    toMatchSnapshot(expect, store, 'set one');

    store.update(
      setEntitiesMap({
        2: createTodo(2),
      })
    );
    toMatchSnapshot(expect, store, 'set one');
  });

  it('should set entities work with ref', () => {
    const store = createUIEntityStore();
    store.update(setEntities([createUITodo(1)], { ref: UIEntitiesRef }));
    toMatchSnapshot(expect, store, 'set one');

    store.update(setEntities([createUITodo(2)], { ref: UIEntitiesRef }));
    toMatchSnapshot(expect, store, 'set one');
  });
});
