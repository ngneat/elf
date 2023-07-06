import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  Todo,
} from '@ngneat/elf-mocks';
import {
  getAllEntitiesApply,
  getAllEntities,
  getEntity,
  hasEntity,
  getEntitiesIds,
  getEntityByPredicate,
} from './queries';
import { addEntities } from './add.mutation';
import { UIEntitiesRef } from './entity.state';
import { expectTypeOf } from 'expect-type';
import { deleteEntities } from './delete.mutation';

describe('queries', () => {
  describe('getEntitiesIds', () => {
    it('should return all the entities ids', () => {
      const store = createEntitiesStore();
      expect(store.query(getEntitiesIds())).toEqual([]);
      const todos = Array.from(Array(3), (_, i) => createTodo(i + 1));

      store.update(addEntities(todos));
      expect(store.query(getEntitiesIds())).toEqual([1, 2, 3]);
      store.update(deleteEntities([2]));
      expect(store.query(getEntitiesIds())).toEqual([1, 3]);
    });

    it('should work with ref', () => {
      const store = createUIEntityStore();
      expect(store.query(getEntitiesIds({ ref: UIEntitiesRef }))).toEqual([]);
      const todos = Array.from(Array(3), (_, i) => createUITodo(i + 1));

      store.update(addEntities(todos, { ref: UIEntitiesRef }));
      expect(store.query(getEntitiesIds({ ref: UIEntitiesRef }))).toEqual([
        1, 2, 3,
      ]);
      store.update(deleteEntities([2], { ref: UIEntitiesRef }));
      expect(store.query(getEntitiesIds({ ref: UIEntitiesRef }))).toEqual([
        1, 3,
      ]);
    });
  });

  describe('getEntity', () => {
    it('should return an entity', () => {
      const store = createEntitiesStore();

      expect(store.query(getEntity(1))).toEqual(undefined);
      const todo = createTodo(1);
      store.update(addEntities(todo));
      expect(store.query(getEntity(1))).toEqual(todo);
    });

    it('should return an entity by predicate', () => {
      const store = createEntitiesStore();

      store.update(
        addEntities([
          createTodo(1),
          {
            id: 4,
            title: `todo 2`,
            completed: false,
          },
          createTodo(3),
        ])
      );
      expect(
        store.query(getEntityByPredicate((el) => el.title === `todo 2`))?.id
      ).toEqual(4);
    });

    it('should work with ref', () => {
      const store = createUIEntityStore();
      expect(store.query(getEntity(1, { ref: UIEntitiesRef }))).toEqual(
        undefined
      );

      const todo = createUITodo(1);
      store.update(addEntities(todo, { ref: UIEntitiesRef }));
      expect(store.query(getEntity(1, { ref: UIEntitiesRef }))).toEqual(todo);
    });

    it('should find by predicate with ref', () => {
      const store = createUIEntityStore();
      expect(
        store.query(
          getEntityByPredicate((el) => el.id === 1, { ref: UIEntitiesRef })
        )
      ).toEqual(undefined);

      store.update(
        addEntities([createUITodo(1), createUITodo(2), createUITodo(3)], {
          ref: UIEntitiesRef,
        })
      );
      expect(
        store.query(
          getEntityByPredicate((el) => el.id === 2, { ref: UIEntitiesRef })
        )?.id
      ).toEqual(2);
    });
  });

  describe('hasEntity', () => {
    it('should check whether the entity exists', () => {
      const store = createEntitiesStore();

      expect(store.query(hasEntity(1))).toEqual(false);

      store.update(addEntities(createTodo(1)));
      expect(store.query(hasEntity(1))).toEqual(true);
    });

    it('should work with ref', () => {
      const store = createUIEntityStore();
      expect(store.query(hasEntity(1, { ref: UIEntitiesRef }))).toEqual(false);

      store.update(addEntities(createUITodo(1), { ref: UIEntitiesRef }));
      expect(store.query(hasEntity(1, { ref: UIEntitiesRef }))).toEqual(true);
    });
  });

  describe('getAllEntities', () => {
    it('should return the collection', () => {
      const store = createEntitiesStore();
      store.update(addEntities(createTodo(1)));
      expect(store.query(getAllEntities())).toMatchInlineSnapshot(`
        Array [
          Object {
            "completed": false,
            "id": 1,
            "title": "todo 1",
          },
        ]
      `);
    });

    it('should work with ref', () => {
      const store = createUIEntityStore();

      store.update(addEntities(createUITodo(1), { ref: UIEntitiesRef }));
      expect(store.query(getAllEntities({ ref: UIEntitiesRef })))
        .toMatchInlineSnapshot(`
        Array [
          Object {
            "id": 1,
            "open": false,
          },
        ]
      `);
    });
  });

  it('should getAllEntitiesApply', () => {
    const store = createEntitiesStore();
    store.update(addEntities([createTodo(1), createTodo(2)]));

    const entities = store.query(
      getAllEntitiesApply({ filterEntity: (e) => e.id === 1 })
    );

    expectTypeOf(entities).toEqualTypeOf<Todo[]>();

    const titles = store.query(
      getAllEntitiesApply({ mapEntity: (e) => e.title })
    );

    expectTypeOf(titles).toEqualTypeOf<string[]>();

    expect(store.query(getAllEntitiesApply({ mapEntity: (e) => e.title })))
      .toMatchInlineSnapshot(`
      Array [
        "todo 1",
        "todo 2",
      ]
    `);

    expect(
      store.query(
        getAllEntitiesApply({
          mapEntity: (e) => e.title,
          filterEntity: (e) => e.id === 1,
        })
      )
    ).toMatchInlineSnapshot(`
      Array [
        "todo 1",
      ]
    `);
  });
});
