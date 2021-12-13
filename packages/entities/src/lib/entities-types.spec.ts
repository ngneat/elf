import {
  createEntitiesStore,
  createUIEntityStore,
  Todo,
  UITodo,
} from '@ngneat/elf-mocks';
import {
  addEntities,
  selectAll,
  selectEntitiesCount,
  selectEntitiesCountByPredicate,
  selectEntity,
  selectFirst,
  selectLast,
  selectMany,
  UIEntitiesRef,
  withEntities,
} from '@ngneat/elf-entities';
import { expectTypeOf } from 'expect-type';
import { createState, SomeArray, Store, withProps } from '@ngneat/elf';

describe('Entities Types', () => {
  it('should assert createState', () => {
    const { state, config } = createState(
      withProps<{ foo: string }>({ foo: '' })
    );
    const store = new Store({ state, config, name: '' });

    // @ts-expect-error - We didn't provide withEntities
    store.pipe(selectAll());

    // @ts-expect-error - We didn't provide withUIEntities
    store.pipe(selectAll({ ref: UIEntitiesRef }));
  });

  it('should assert createState with withEntities', () => {
    const { state, config } = createState(withEntities());
    const store = new Store({ state, config, name: '' });

    store.pipe(selectAll());

    // @ts-expect-error - We didn't provide withUIEntities
    store.pipe(selectAll({ ref: UIEntitiesRef }));
  });

  it('should assert idKey', () => {
    // @ts-expect-error - The default idKey is `id` and we didn't have it in our type
    createState(withEntities<{ _id: string }>());

    createState(withEntities<{ _id: string }, '_id'>({ idKey: '_id' }));
  });

  describe('entities', () => {
    const store = createEntitiesStore();

    it('should set the correct types', () => {
      store.pipe(selectAll()).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<SomeArray<Todo>>();
      });

      store.pipe(selectEntity(1)).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<Todo | undefined>();
      });

      store.pipe(selectEntity(1, { pluck: 'title' })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<string | undefined>();
      });

      store.pipe(selectEntity(1, { pluck: (e) => e.title })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<string | undefined>();
      });

      store.pipe(selectMany([1])).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<SomeArray<Todo>>();
      });

      store.pipe(selectMany([1], { pluck: 'title' })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<string[]>();
      });

      store.pipe(selectMany([1], { pluck: (e) => e.title })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<string[]>();
      });

      store.pipe(selectFirst()).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<Todo | undefined>();
      });

      store.pipe(selectLast()).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<Todo | undefined>();
      });

      store.pipe(selectEntitiesCount()).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<number>();
      });

      store
        .pipe(selectEntitiesCountByPredicate((e) => e.completed))
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<number>();
        });

      try {
        store.update(
          // @ts-expect-error - We don't have withUIEntities
          addEntities(
            { id: 1, title: '', completed: true },
            { ref: UIEntitiesRef }
          )
        );

        // @ts-expect-error - We didn't provide the complete entity
        store.update(addEntities({ id: 1 }));

        store.update(
          // @ts-expect-error - We provide an additional property that doesn't exists
          addEntities({ id: 1, title: '', completed: true, foo: 1 })
        );
      } catch {
        //
      }
    });
  });

  describe('UIEntities', () => {
    const store = createUIEntityStore();

    it('should set the correct types', () => {
      store.pipe(selectAll({ ref: UIEntitiesRef })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<SomeArray<UITodo>>();
      });

      store.pipe(selectEntity(1, { ref: UIEntitiesRef })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<UITodo | undefined>();
      });

      store
        .pipe(selectEntity(1, { pluck: 'open', ref: UIEntitiesRef }))
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<boolean | undefined>();
        });

      store
        .pipe(selectEntity(1, { pluck: (e) => e.open, ref: UIEntitiesRef }))
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<boolean | undefined>();
        });

      store.pipe(selectMany([1], { ref: UIEntitiesRef })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<SomeArray<UITodo>>();
      });

      store
        .pipe(selectMany([1], { pluck: 'open', ref: UIEntitiesRef }))
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<boolean[]>();
        });

      store
        .pipe(selectMany([1], { pluck: (e) => e.open, ref: UIEntitiesRef }))
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<boolean[]>();
        });

      store.pipe(selectFirst({ ref: UIEntitiesRef })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<UITodo | undefined>();
      });

      store.pipe(selectLast({ ref: UIEntitiesRef })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<UITodo | undefined>();
      });

      store.pipe(selectEntitiesCount({ ref: UIEntitiesRef })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<number>();
      });

      store
        .pipe(
          selectEntitiesCountByPredicate((e) => e.open, { ref: UIEntitiesRef })
        )
        .subscribe((v) => {
          expectTypeOf(v).toEqualTypeOf<number>();
        });

      try {
        // @ts-expect-error - We didn't provide the complete entity
        store.update(addEntities({ id: 1 }, { ref: UIEntitiesRef }));

        store.update(
          // @ts-expect-error - We provide an additional property that doesn't exists
          addEntities({ id: 1, open: true, foo: 1 }, { ref: UIEntitiesRef })
        );
      } catch {
        //
      }
    });
  });
});
