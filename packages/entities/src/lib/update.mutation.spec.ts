import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  Todo,
  toMatchSnapshot,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import { UIEntitiesRef } from './entity.state';
import {
  updateAllEntities,
  updateEntities,
  updateEntitiesByPredicate,
  updateEntitiesIds,
  upsertEntities,
  upsertEntitiesById,
} from './update.mutation';

describe('update', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should update one entity', () => {
    store.update(addEntities(createTodo(1)));
    toMatchSnapshot(expect, store, 'completed false');
    store.update(updateEntities(1, { completed: true }));
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should update multiple entities', () => {
    store.update(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'multi completed false');
    store.update(updateEntities([1, 2], { completed: true }));
    toMatchSnapshot(expect, store, 'multi completed true');
  });

  it('should update by callback', () => {
    store.update(addEntities(createTodo(1)));
    toMatchSnapshot(expect, store, 'completed false');
    store.update(
      updateEntities(1, (todo) => ({ ...todo, completed: !todo.completed }))
    );
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should update by predicate', () => {
    store.update(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'completed false');
    store.update(
      updateEntitiesByPredicate((entity) => entity.id === 1, {
        completed: true,
      })
    );
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should update all', () => {
    store.update(addEntities([createTodo(1), createTodo(2)]));
    toMatchSnapshot(expect, store, 'completed false');
    store.update(updateAllEntities({ completed: true }));
    toMatchSnapshot(expect, store, 'completed true');
  });

  it('should work with ref', () => {
    const store = createUIEntityStore();
    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
    toMatchSnapshot(expect, store, 'open false');
    store.update(updateEntities(1, { open: true }, { ref: UIEntitiesRef }));
    toMatchSnapshot(expect, store, 'open true');
  });

  it('should work with ref update all', () => {
    const store = createUIEntityStore();
    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
    toMatchSnapshot(expect, store, 'open false');
    store.update(updateAllEntities({ open: true }, { ref: UIEntitiesRef }));
    toMatchSnapshot(expect, store, 'open true');
  });

  describe('UpsertById', () => {
    const updater = (e: Todo) => ({ ...e, title: 'elf' });
    const creator = (id: number) => createTodo(id);
    const options = {
      updater,
      creator,
    };

    it(`should add the entity if it doesn't exists`, () => {
      const store = createEntitiesStore();
      store.update(
        addEntities([createTodo(1)]),
        upsertEntitiesById(2, options)
      );
      toMatchSnapshot(expect, store, 'two entities');
    });

    it('should update an entity if exists', () => {
      const store = createEntitiesStore();
      store.update(
        addEntities([createTodo(1)]),
        upsertEntitiesById(1, options)
      );
      toMatchSnapshot(expect, store, 'one entity, title "elf"');
    });

    it('should add the missing entities and update existing', () => {
      const store = createEntitiesStore();
      store.update(
        addEntities([createTodo(1)]),
        upsertEntitiesById([1, 2], options)
      );
      toMatchSnapshot(
        expect,
        store,
        'two entities, 1: title "elf", 2: title "todo 2"'
      );
    });

    it('should merge updater with creator', () => {
      const store = createEntitiesStore();
      store.update(
        addEntities([createTodo(1)]),
        upsertEntitiesById([1, 2], {
          ...options,
          mergeUpdaterWithCreator: true,
        })
      );
      toMatchSnapshot(expect, store, 'two entities, title "elf"');
    });

    it('should work with ref', () => {
      const store = createUIEntityStore();
      store.update(
        addEntities([createUITodo(1)], { ref: UIEntitiesRef }),
        upsertEntitiesById([1, 2], {
          updater: (e) => ({ ...e, open: false }),
          creator: (id) => createUITodo(id),
          mergeUpdaterWithCreator: true,
          ref: UIEntitiesRef,
        })
      );
      toMatchSnapshot(expect, store, 'two entities, open true');
    });
  });

  describe('Upsert', () => {
    it(`should add the entity if it doesn't exists`, () => {
      const store = createEntitiesStore();
      store.update(upsertEntities([createTodo(1)]));
      toMatchSnapshot(expect, store, 'one entities');
    });

    it(`should update the entity if it has the same id`, () => {
      const store = createEntitiesStore();

      const todo = createTodo(1);
      store.update(addEntities([todo]));

      // update the todo
      store.update(upsertEntities([{ id: 1, completed: true }]));

      toMatchSnapshot(expect, store, 'updated entity with completed: true');
    });

    it('should work with ref', () => {
      const store = createUIEntityStore();
      store.update(
        addEntities([createUITodo(1)], { ref: UIEntitiesRef }),
        upsertEntities([{ id: 1, open: true }], { ref: UIEntitiesRef })
      );
      toMatchSnapshot(expect, store, 'one ui entity, open true');
    });

    it('if no ids are added, the id array should be the same ref', () => {
      const store = createEntitiesStore();
      store.update(addEntities([createTodo(1), createTodo(2)]));
      const ids = store.getValue().ids;

      store.update(upsertEntities([{ id: 1, completed: true }]));
      const sameIds = store.getValue().ids;

      expect(ids).toBe(sameIds);
    });
  });

  describe('UpdateEntitiesIds', () => {
    it('should support id update', () => {
      store.update(addEntities([createTodo(1)]));
      toMatchSnapshot(expect, store, 'id updated false');
      store.update(updateEntitiesIds(1, 2));
      toMatchSnapshot(expect, store, 'id updated true');
    });

    it('should update multiple ids', () => {
      store.update(addEntities([createTodo(1), createTodo(2), createTodo(3)]));
      toMatchSnapshot(expect, store, 'ids updated false');
      store.update(updateEntitiesIds([2, 3], [4, 5]));
      toMatchSnapshot(expect, store, 'ids updated true');
    });

    it('should throw if new id already exists in the store', () => {
      store.update(addEntities([createTodo(1), createTodo(2)]));
      expect(() => {
        store.update(updateEntitiesIds(1, 2));
      }).toThrow();
    });

    it('should work with ref', () => {
      const store = createUIEntityStore();
      store.update(addEntities([createUITodo(1)], { ref: UIEntitiesRef }));
      toMatchSnapshot(expect, store, 'id updated false');
      store.update(updateEntitiesIds(1, 2, { ref: UIEntitiesRef }));
      toMatchSnapshot(expect, store, 'id updated true');
    });

    it('should update entity after changing the id', () => {
      store.update(addEntities([createTodo(1)]));
      store.update(
        updateEntitiesIds(1, 2),
        updateEntities(2, { completed: true })
      );
      toMatchSnapshot(expect, store, 'id updated true, completed true');
    });
  });
});
