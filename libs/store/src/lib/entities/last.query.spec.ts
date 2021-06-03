import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { entitiesUIRef } from './entity.state';
import { selectLast } from './last.query';

describe('last', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select the last entity', () => {
    store.pipe(selectLast()).subscribe((value) => {
      expect(value).toMatchSnapshot();
    });

    store.reduce(addEntities(createTodo(2)));

    store.reduce(addEntities(createTodo(21), { prepend: true }));

    store.reduce(addEntities(createTodo(3)));
  });

  it('should support ref', () => {
    const store = createUIEntityStore();

    store.pipe(selectLast({ ref: entitiesUIRef })).subscribe((value) => {
      expect(value).toMatchSnapshot();
    });

    store.reduce(
      addEntities([createUITodo(1), createUITodo(2)], { ref: entitiesUIRef })
    );
  });
});
