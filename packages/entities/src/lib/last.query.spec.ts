import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import { UIEntitiesRef } from './entity.state';
import { selectLast } from './last.query';

describe('last', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select the last entity', () => {
    store.pipe(selectLast()).subscribe((value) => {
      expect(value).toMatchSnapshot('2 calls');
    });

    store.update(addEntities(createTodo(2)));

    store.update(addEntities(createTodo(21), { prepend: true }));

    store.update(addEntities(createTodo(3)));
  });

  it('should support ref', () => {
    const store = createUIEntityStore();

    store.pipe(selectLast({ ref: UIEntitiesRef })).subscribe((value) => {
      expect(value).toMatchSnapshot('2 calls');
    });

    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
  });
});
