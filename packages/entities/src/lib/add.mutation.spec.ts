import { createStore } from '@ngneat/elf';
import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  toMatchSnapshot,
} from '@ngneat/elf-mocks';
import { addEntities, addEntitiesFifo } from './add.mutation';
import { UIEntitiesRef, withEntities, withUIEntities } from './entity.state';

describe('add', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should add entity', () => {
    store.update(addEntities(createTodo(1)));
    toMatchSnapshot(expect, store, 'add one');
  });

  it('should add multiple entities', () => {
    store.update(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'add two');
  });

  it('should prepend entities', () => {
    store.update(addEntities([createTodo(1), createTodo(2)]));
    store.update(
      addEntities([createTodo(3), createTodo(4)], { prepend: true })
    );
    toMatchSnapshot(expect, store, 'prepend');
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
    toMatchSnapshot(expect, store, 'ref');
  });

  it('should work a different idKey', () => {
    const store = createStore(
      { name: '' },
      withEntities<{ id: number }>(),
      withUIEntities<{ _id: string; name: string }, '_id'>({ idKey: '_id' })
    );
    store.update(
      addEntities({ _id: '1', name: 'foo' }, { ref: UIEntitiesRef })
    );
    store.update(addEntities({ id: 1 }));
    expect(store.getValue()).toMatchSnapshot();
  });

  describe('addEntitiesFifo', () => {
    it('should work', () => {
      const limit = 3;
      store.update(
        addEntitiesFifo([createTodo(1), createTodo(2), createTodo(3)], {
          limit,
        })
      );
      store.update(addEntitiesFifo([createTodo(4)], { limit }));

      expect(store.getValue()).toMatchSnapshot('should be 4 3 2');

      store.update(addEntitiesFifo([createTodo(5), createTodo(6)], { limit }));
      expect(store.getValue()).toMatchSnapshot('should be 6 5 4');

      store.update(
        addEntitiesFifo([createTodo(1), createTodo(2), createTodo(3)], {
          limit,
        })
      );
      expect(store.getValue()).toMatchSnapshot('should be 3 2 1');

      store.update(
        addEntitiesFifo(
          [createTodo(4), createTodo(5), createTodo(6), createTodo(7)],
          { limit }
        )
      );
      expect(store.getValue()).toMatchSnapshot('should be 7 6 5');

      store.update(addEntitiesFifo([], { limit }));
      expect(store.getValue()).toMatchSnapshot('should be 7 6 5 empty array');
    });
  });
});
