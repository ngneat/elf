import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  Todo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import {
  selectEntitiesCount,
  selectEntitiesCountByPredicate,
  getEntitiesCount,
  getEntitiesCountByPredicate,
} from './count.query';
import { updateEntities } from './update.mutation';
import { UIEntitiesRef } from './entity.state';
import { deleteEntities } from '@ngneat/elf-entities';

describe('count', () => {
  function predicate(entity: Todo) {
    return entity.completed;
  }

  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select the count', () => {
    let count = 1;

    store.pipe(selectEntitiesCount()).subscribe((value) => {
      expect(value).toMatchSnapshot(`calls: ${count++}`);
    });

    store.update(addEntities(createTodo(2)));
  });

  it('should work with ref', () => {
    let count = 1;

    const store = createUIEntityStore();

    store
      .pipe(selectEntitiesCount({ ref: UIEntitiesRef }))
      .subscribe((value) => {
        expect(value).toMatchSnapshot(`calls: ${count++}`);
      });

    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
  });

  it('should select the count by predicate', () => {
    let count = 1;

    store.pipe(selectEntitiesCountByPredicate(predicate)).subscribe((value) => {
      expect(value).toMatchSnapshot(`calls: ${count++}`);
    });

    store.update(addEntities([createTodo(1), createTodo(2)]));

    store.update(updateEntities(1, { completed: true }));

    store.update(updateEntities(2, { title: '' }));
  });

  describe('get', () => {
    it('should get the count', () => {
      const store = createEntitiesStore();
      expect(store.query(getEntitiesCount())).toEqual(0);

      store.update(addEntities([createTodo(1), createTodo(2)]));

      expect(store.query(getEntitiesCount())).toEqual(2);

      store.update(deleteEntities(1));

      expect(store.query(getEntitiesCount())).toEqual(1);
    });

    it('should get the count by predicate', () => {
      const store = createEntitiesStore();
      store.update(addEntities([createTodo(1), createTodo(2)]));

      expect(store.query(getEntitiesCountByPredicate(predicate))).toEqual(0);

      store.update(
        updateEntities(1, { completed: true }),
        updateEntities(2, { title: '' })
      );

      expect(store.query(getEntitiesCountByPredicate(predicate))).toEqual(1);
    });

    it('should work with ref', () => {
      const uiStore = createUIEntityStore();
      expect(uiStore.query(getEntitiesCount({ ref: UIEntitiesRef }))).toEqual(
        0
      );

      uiStore.update(
        addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
      );

      expect(uiStore.query(getEntitiesCount({ ref: UIEntitiesRef }))).toEqual(
        2
      );

      uiStore.update(deleteEntities(1, { ref: UIEntitiesRef }));

      expect(uiStore.query(getEntitiesCount({ ref: UIEntitiesRef }))).toEqual(
        1
      );
    });
  });
});
