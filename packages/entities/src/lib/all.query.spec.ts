import {
  createEntitiesStore,
  createTodo,
  createUIEntityStore,
  createUITodo,
  Todo,
} from '@ngneat/elf-mocks';
import { addEntities } from './add.mutation';
import {
  selectAllEntities,
  selectAllEntitiesApply,
  selectEntities,
} from './all.query';
import { UIEntitiesRef } from './entity.state';
import { expectTypeOf } from 'expect-type';
import { updateEntities } from '@ngneat/elf-entities';

describe('selectAllEntities', () => {
  let store: ReturnType<typeof createEntitiesStore>;

  beforeEach(() => {
    store = createEntitiesStore();
  });

  it('should select all', () => {
    let count = 1;

    store.pipe(selectAllEntities()).subscribe((value) => {
      expect(value).toMatchSnapshot(`calls: ${count++}`);
    });

    store.update(addEntities(createTodo(2)));
  });

  it('should work with ref', () => {
    let count = 1;

    const store = createUIEntityStore();

    store.pipe(selectAllEntities({ ref: UIEntitiesRef })).subscribe((value) => {
      expect(value).toMatchSnapshot(`calls: ${count++}`);
    });

    store.update(
      addEntities([createUITodo(1), createUITodo(2)], { ref: UIEntitiesRef })
    );
  });

  it('should observe entities object', () => {
    store.pipe(selectEntities()).subscribe((v) => {
      expect(v).toMatchSnapshot('should be an object');
    });

    store.update(addEntities(createTodo(1)));
  });

  describe('selectAllEntitiesApply', () => {
    const store = createEntitiesStore();

    store.update(
      addEntities(createTodo(1)),
      addEntities(createTodo(2)),
      updateEntities(1, { completed: true })
    );

    it('should map', () => {
      store
        .pipe(selectAllEntitiesApply({ mapEntity: (e) => e.title }))
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<string[]>();
          expect(v).toStrictEqual(['todo 1', 'todo 2']);
        });
    });

    it('should filter', () => {
      store
        .pipe(selectAllEntitiesApply({ filterEntity: (e) => e.completed }))
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<Todo[]>();
          expect(v).toStrictEqual([
            { id: 1, title: 'todo 1', completed: true },
          ]);
        });
    });

    it('should filter and then map', () => {
      store
        .pipe(
          selectAllEntitiesApply({
            mapEntity: (e) => e.title,
            filterEntity: (e) => e.completed,
          })
        )
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<string[]>();
          expect(v).toStrictEqual(['todo 1']);
        });
    });

    it('should filter and then map entities ref', () => {
      const store = createUIEntityStore();

      store.update(
        addEntities(createUITodo(1), { ref: UIEntitiesRef }),
        addEntities(createUITodo(2), { ref: UIEntitiesRef }),
        updateEntities(1, { open: true }, { ref: UIEntitiesRef })
      );

      store
        .pipe(
          selectAllEntitiesApply({
            mapEntity: (e) => e.id,
            filterEntity: (e) => e.open,
            ref: UIEntitiesRef,
          })
        )
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<number[]>();
          expect(v).toStrictEqual([1]);
        });
    });
  });
});
