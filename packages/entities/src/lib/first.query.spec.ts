import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import { selectFirst } from './first.query';
import { UIEntitiesRef } from './entity.state';

describe('first', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select the first entity', () => {
    store.pipe(selectFirst()).subscribe((value) => {
      expect(value).toMatchSnapshot('3 calls');
    });

    store.update(addEntities(createTodo(2)));

    store.update(addEntities(createTodo(3), { prepend: true }));
  });

  it('should support ref', () => {
    const store = createUIEntityStore();

    store.pipe(selectFirst({ ref: UIEntitiesRef })).subscribe((value) => {
      expect(value).toMatchSnapshot('2 calls');
    });

    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
  });
});
