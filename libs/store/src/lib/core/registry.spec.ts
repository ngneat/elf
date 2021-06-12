import { createEntitiesStore, createTodo } from '../mocks/stores.mock';
import { addEntities } from '../entities/add.mutation';

describe('registry', () => {
  it('', () => {


    const store = createEntitiesStore();

    store.reduce(
      addEntities(createTodo(1))
    )

    createEntitiesStore('foo')
    expect(true).toBeTruthy();
  });
});
