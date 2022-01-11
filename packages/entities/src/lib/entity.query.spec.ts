import { createState, Store } from '@ngneat/elf';
import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import { selectEntity, selectEntityByPredicate } from './entity.query';
import { UIEntitiesRef, withUIEntities } from './entity.state';
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

  it('should select an entity by predicate', () => {
    store
      .pipe(selectEntityByPredicate((entity) => entity.title === 'todo 1'))
      .subscribe((entity) => {
        expect(entity).toMatchSnapshot(`2 calls`);
      });

    store.update(addEntities(createTodo(1)));
    store.update(addEntities(createTodo(2)));
  });

  it('should select an entity by predicate pluck property', () => {
    store
      .pipe(
        selectEntityByPredicate((entity) => entity.title === 'todo 1', {
          pluck: 'title',
        })
      )
      .subscribe((title) => {
        expect(title).toMatchSnapshot(`2 calls`);
      });

    store.update(addEntities(createTodo(1)));
    store.update(updateEntities(1, { completed: true }));
  });

  it('should select an entity by predicate pluck mapper', () => {
    store
      .pipe(
        selectEntityByPredicate((entity) => entity.title === 'todo 1', {
          pluck: (entity) => entity.title,
        })
      )
      .subscribe((title) => {
        expect(title).toMatchSnapshot(`2 calls`);
      });

    store.update(addEntities(createTodo(1)));
    store.update(updateEntities(1, { completed: true }));
  });

  it('should select an entity by predicate with ref', () => {
    const store = createUIEntityStore();

    store
      .pipe(
        selectEntityByPredicate((entity) => entity.id === 1, {
          ref: UIEntitiesRef,
        })
      )
      .subscribe((entity) => {
        expect(entity).toMatchSnapshot(`2 calls`);
      });

    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
  });

  it('should select an entity by predicate with custom id key', () => {
    const store = createUIEntityStoreCustomKey();

    store
      .pipe(
        selectEntityByPredicate((entity) => entity._id === 1, {
          ref: UIEntitiesRef,
          idKey: '_id',
        })
      )
      .subscribe((entity) => {
        expect(entity).toMatchSnapshot(`2 calls`);
      });

    store.update(
      addEntities([createUITodoCustomKey(1), createUITodoCustomKey(2)], {
        ref: UIEntitiesRef,
      })
    );
  });
});

const createUIEntityStoreCustomKey = (name = 'UIEntityStoreCustomKey') =>
  new Store({
    name,
    ...createState(withUIEntities<UITodoCustomKey, '_id'>({ idKey: '_id' })),
  });

interface UITodoCustomKey {
  _id: number;
  open: boolean;
}

function createUITodoCustomKey(_id: number): {
  _id: number;
  open: boolean;
} {
  return {
    _id,
    open: false,
  };
}
