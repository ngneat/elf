import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  toMatchSnapshot,
} from '../mocks/stores.mock';
import { addEntities, addEntitiesFifo } from './add.mutation';
import { UIEntitiesRef, withEntities, withUIEntities } from './entity.state';
import { createState, Store } from '../core';

describe('add', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should add entity', () => {
    store.reduce(addEntities(createTodo(1)));
    toMatchSnapshot(expect, store, 'add one');
  });

  it('should add multiple entities', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'add two');
  });

  it('should prepend entities', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    store.reduce(
      addEntities([createTodo(3), createTodo(4)], { prepend: true })
    );
    toMatchSnapshot(expect, store, 'prepend');
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.reduce(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
    toMatchSnapshot(expect, store, 'ref');
  });

  it('should work a different idKey', () => {
    const { state, config } = createState(
      withEntities<{ id: number }>(),
      withUIEntities<{ _id: string; name: string }, '_id'>({ idKey: '_id' })
    );
    const store = new Store({ state, name: '', config });
    store.reduce(
      addEntities({ _id: '1', name: 'foo' }, { ref: UIEntitiesRef })
    );
    store.reduce(addEntities({ id: 1 }));
    expect(store.state).toMatchSnapshot();
  });

  describe('addEntitiesFifo', () => {
    it('should work', () => {
      const limit = 3;
      store.reduce(
        addEntitiesFifo([createTodo(1), createTodo(2), createTodo(3)], {
          limit,
        })
      );
      store.reduce(addEntitiesFifo([createTodo(4)], { limit }));

      expect(store.state).toMatchSnapshot('should be 4 3 2');

      store.reduce(addEntitiesFifo([createTodo(5), createTodo(6)], { limit }));
      expect(store.state).toMatchSnapshot('should be 6 5 4');

      store.reduce(
        addEntitiesFifo([createTodo(1), createTodo(2), createTodo(3)], {
          limit,
        })
      );
      expect(store.state).toMatchSnapshot('should be 3 2 1');

      store.reduce(
        addEntitiesFifo(
          [createTodo(4), createTodo(5), createTodo(6), createTodo(7)],
          { limit }
        )
      );
      expect(store.state).toMatchSnapshot('should be 7 6 5');

      store.reduce(addEntitiesFifo([], { limit }));
      expect(store.state).toMatchSnapshot('should be 7 6 5 empty array');
    });
  });
});
