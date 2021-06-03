import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { selectFirst } from './first.query';
import { entitiesUIRef } from './entity.state';

describe('first', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select the first entity', () => {
    store.pipe(selectFirst()).subscribe((value) => {
      expect(value).toMatchSnapshot();
    });

    store.reduce(addEntities(createTodo(2)));

    store.reduce(addEntities(createTodo(3), { prepend: true }));
  });

  it('should support ref', () => {
    const store = createUIEntityStore();

    store.pipe(selectFirst({ ref: entitiesUIRef })).subscribe((value) => {
      expect(value).toMatchSnapshot();
    });

    store.reduce(
      addEntities([createUITodo(1), createUITodo(2)], { ref: entitiesUIRef })
    );
  });
});
