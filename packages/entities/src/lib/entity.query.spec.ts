import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import { selectEntity } from './entity.query';
import { UIEntitiesRef } from './entity.state';
import { updateEntities } from './update.mutation';

describe('selectEntity', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select an entity', () => {
    store.pipe(selectEntity(1)).subscribe((entity) => {
      expect(entity).toMatchSnapshot(`2 calls`);
    });

    store.update(addEntities(createTodo(1)));
    store.update(addEntities(createTodo(2)));
  });

  it('should select an entity pluck property', () => {
    store.pipe(selectEntity(1, { pluck: 'title' })).subscribe((title) => {
      expect(title).toMatchSnapshot(`2 calls`);
    });

    store.update(addEntities(createTodo(1)));
  });

  it('should select an entity pluck mapper', () => {
    store
      .pipe(selectEntity(1, { pluck: (entity) => entity.title }))
      .subscribe((title) => {
        expect(title).toMatchSnapshot(`2 calls`);
      });

    store.update(addEntities(createTodo(1)));
    store.update(updateEntities(1, { completed: true }));
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.pipe(selectEntity(1, { ref: UIEntitiesRef })).subscribe((entity) => {
      expect(entity).toMatchSnapshot(`2 calls`);
    });

    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
  });
});
