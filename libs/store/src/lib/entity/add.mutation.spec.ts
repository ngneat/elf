import { createEntitiesStore, createTodo, toMatchSnapshot } from '../mocks/stores.mock';
import { addEntity } from './add.mutation';

describe('add', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should add entity', () => {
    store.reduce(addEntity(createTodo(1)));
    toMatchSnapshot(expect, store);
  });

  it('should add multiple entities', () => {
    store.reduce(addEntity([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store);
  });

  it('should prepend entities', () => {
    store.reduce(addEntity([createTodo(1), createTodo(2)]));
    store.reduce(addEntity([createTodo(3), createTodo(4)], { prepend: true }));
    toMatchSnapshot(expect, store);
  });

  it('should overwrite entities', () => {
    store.reduce(addEntity([createTodo(1), createTodo(2)]));
    store.reduce(addEntity([createTodo(3), createTodo(4)], { overwrite: true }));
    toMatchSnapshot(expect, store);
  });

});
