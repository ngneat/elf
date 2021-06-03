import { createEntitiesStore, createTodo, createUIEntityStore, createUITodo, toMatchSnapshot } from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { entitiesUIRef } from './entity.state';

describe('add', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should add entity', () => {
    store.reduce(addEntities(createTodo(1)));
    toMatchSnapshot(expect, store);
  });

  it('should add multiple entities', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store);
  });

  it('should prepend entities', () => {
    store.reduce(addEntities([createTodo(1), createTodo(2)]));
    store.reduce(addEntities([createTodo(3), createTodo(4)], { prepend: true }));
    toMatchSnapshot(expect, store);
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.reduce(addEntities([createUITodo(1), createUITodo(2)], { ref: entitiesUIRef }));
    toMatchSnapshot(expect, store);
  });

});
