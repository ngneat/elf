import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import {
  selectEntitiesCount,
  selectEntitiesCountByPredicate,
} from './count.query';
import { updateEntities } from './update.mutation';
import { UIEntitiesRef } from './entity.state';

describe('count', () => {
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

    store
      .pipe(selectEntitiesCountByPredicate((entity) => entity.completed))
      .subscribe((value) => {
        expect(value).toMatchSnapshot(`calls: ${count++}`);
      });

    store.update(addEntities([createTodo(1), createTodo(2)]));

    store.update(updateEntities(1, { completed: true }));

    store.update(updateEntities(2, { title: '' }));
  });
});
