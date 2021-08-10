import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  toMatchSnapshot,
} from '../mocks/stores.mock';
import { setEntities } from './set.mutation';
import { entitiesUIRef } from './entity.state';

describe('set', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should set entities', () => {
    store.reduce(setEntities(createTodo(1)));
    toMatchSnapshot(expect, store, 'set one');

    store.reduce(setEntities(createTodo(2)));
    toMatchSnapshot(expect, store, 'set one');
  });

  it('should set entities work with ref', () => {
    const store = createUIEntityStore();
    store.reduce(setEntities(createUITodo(1), { ref: entitiesUIRef }));
    toMatchSnapshot(expect, store, 'set one');

    store.reduce(setEntities(createUITodo(2), { ref: entitiesUIRef }));
    toMatchSnapshot(expect, store, 'set one');
  });
});
