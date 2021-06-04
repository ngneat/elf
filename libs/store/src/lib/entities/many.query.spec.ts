import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '../mocks/stores.mock';
import { addEntities } from './add.mutation';
import { selectMany } from './many.query';
import { updateEntities } from './update.mutation';
import { removeEntities } from './remove.mutation';
import { entitiesUIRef } from './entity.state';

describe('selectMany', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select many', () => {
    let count = 1;

    store.pipe(selectMany([1, 2])).subscribe((value) => {
      expect(value).toMatchSnapshot(`calls: ${count++}`);
    });

    store.reduce(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    store.reduce(addEntities(createTodo(4)));

    store.reduce(updateEntities(1, { title: '' }));
    store.reduce(removeEntities(2));
  });

  it('should work with ref', () => {
    let count = 1;

    const store = createUIEntityStore();

    store
      .pipe(selectMany([1, 2], { ref: entitiesUIRef }))
      .subscribe((value) => {
        expect(value).toMatchSnapshot(`calls: ${count++}`);
      });

    store.reduce(
      addEntities([createUITodo(1), createUITodo(2), createUITodo(3)], {
        ref: entitiesUIRef,
      })
    );
    store.reduce(addEntities(createUITodo(4), { ref: entitiesUIRef }));

    store.reduce(updateEntities(1, { open: true }, { ref: entitiesUIRef }));
    store.reduce(removeEntities(2, { ref: entitiesUIRef }));
  });
});
