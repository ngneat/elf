import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import { deleteEntities } from './delete.mutation';
import { UIEntitiesRef } from './entity.state';
import { selectMany, selectManyByPredicate } from './many.query';
import { updateEntities } from './update.mutation';

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

    store.update(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    store.update(addEntities(createTodo(4)));

    store.update(updateEntities(1, { title: '' }));
    store.update(deleteEntities(2));
  });

  it('should work with ref', () => {
    let count = 1;

    const store = createUIEntityStore();

    store
      .pipe(selectMany([1, 2], { ref: UIEntitiesRef }))
      .subscribe((value) => {
        expect(value).toMatchSnapshot(`calls: ${count++}`);
      });

    store.update(
      addEntities([createUITodo(1), createUITodo(2), createUITodo(3)], {
        ref: UIEntitiesRef,
      })
    );
    store.update(addEntities(createUITodo(4), { ref: UIEntitiesRef }));

    store.update(updateEntities(1, { open: true }, { ref: UIEntitiesRef }));
    store.update(deleteEntities(2, { ref: UIEntitiesRef }));
  });

  it('should select many by predicate', () => {
    let count = 1;

    store
      .pipe(selectManyByPredicate((entity) => entity.title === 'todo 1'))
      .subscribe((value) => {
        expect(value).toMatchSnapshot(`calls: ${count++}`);
      });

    store.update(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
    store.update(addEntities(createTodo(4)));

    store.update(updateEntities(1, { title: '' }));
    store.update(deleteEntities(2));
  });

  it('should select many by predicate with ref', () => {
    let count = 1;

    const store = createUIEntityStore();

    store
      .pipe(
        selectManyByPredicate((entity) => entity.open === true, {
          ref: UIEntitiesRef,
        })
      )
      .subscribe((value) => {
        expect(value).toMatchSnapshot(`calls: ${count++}`);
      });

    store.update(
      addEntities([createUITodo(1), createUITodo(2), createUITodo(3)], {
        ref: UIEntitiesRef,
      })
    );
    store.update(addEntities(createUITodo(4), { ref: UIEntitiesRef }));

    store.update(updateEntities(1, { open: true }, { ref: UIEntitiesRef }));
    store.update(deleteEntities(2, { ref: UIEntitiesRef }));
  });
});
