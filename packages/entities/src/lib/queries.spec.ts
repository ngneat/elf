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
} from './queries';
import { addEntities } from './add.mutation';
import { UIEntitiesRef } from './entity.state';
import { expectTypeOf } from 'expect-type';

describe('queries', () => {
  describe('getEntity', () => {
    it('should return an entity', () => {
      const store = createEntitiesStore();

      expect(store.query(getEntity(1))).toEqual(undefined);
      const todo = createTodo(1);
      store.update(addEntities(todo));
      expect(store.query(getEntity(1))).toEqual(todo);
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

    const v = store.query(getAllEntitiesApply({ mapEntity: (e) => e.title }));

    expectTypeOf(v).toEqualTypeOf<Todo[]>();

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
