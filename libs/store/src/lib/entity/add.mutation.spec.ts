import { createEntitieStore, createTodo } from '../mocks/stores.mock';
import { addEntity } from './add.mutation';

describe('add', () => {
  let store: ReturnType<typeof createEntitieStore>;

  beforeEach(() => {
    store = createEntitieStore();
  });

  it('should add entity', () => {
    store.reduce(addEntity(createTodo(1)));
    expect(store.getValue()).toMatchSnapshot();
  });

  it('should add multiple entities', () => {
    store.reduce(addEntity([createTodo(1), createTodo(2)]));
    expect(store.getValue()).toMatchSnapshot();
  });

  it('should prepend entities', () => {
    store.reduce(addEntity([createTodo(1), createTodo(2)]));
    store.reduce(addEntity([createTodo(3), createTodo(4)], { prepend: true }));
    expect(store.getValue()).toMatchSnapshot();
  });

  it('should overwrite entities', () => {
    store.reduce(addEntity([createTodo(1), createTodo(2)]));
    store.reduce(addEntity([createTodo(3), createTodo(4)], { overwrite: true }));
    expect(store.getValue()).toMatchSnapshot();
  });

});
