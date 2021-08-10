import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  toMatchSnapshot,
} from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { entitiesUIRef, withEntities, withUIEntities } from './entity.state';
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
      addEntities([createUITodo(1), createUITodo(2)], { ref: entitiesUIRef })
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
      addEntities({ _id: '1', name: 'foo' }, { ref: entitiesUIRef })
    );
    store.reduce(addEntities({ id: 1 }));
    expect(store.state).toMatchSnapshot();
  });
});
