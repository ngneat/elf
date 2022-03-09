import { createStore, withProps } from '@ngneat/elf';
import {
  addEntities,
  selectAllEntities,
  selectEntitiesCount,
  selectEntitiesCountByPredicate,
  selectEntity,
  selectFirst,
  selectLast,
  selectMany,
  UIEntitiesRef,
  withEntities,
} from '@ngneat/elf-entities';
import {
  createEntitiesStore,
  createUIEntityStore,
  Todo,
  UITodo,
} from '@ngneat/elf-mocks';
import { expectTypeOf } from 'expect-type';

describe('Entities Types', () => {
  it('should assert createState', () => {
    const store = createStore(
      { name: '' },
      withProps<{ foo: string }>({ foo: '' })
    );

    // @ts-expect-error - We didn't provide withEntities
    store.pipe(selectAllEntities());

    // @ts-expect-error - We didn't provide withUIEntities
    store.pipe(selectAllEntities({ ref: UIEntitiesRef }));
  });

  it('should assert createState with withEntities', () => {
    const store = createStore({ name: '' }, withEntities());

    store.pipe(selectAllEntities());

    // @ts-expect-error - We didn't provide withUIEntities
    store.pipe(selectAllEntities({ ref: UIEntitiesRef }));
  });

  it('should assert idKey', () => {
    // @ts-expect-error - The default idKey is `id` and we didn't have it in our type
    withEntities<{ _id: string }>();

    withEntities<{ _id: string }, '_id'>({ idKey: '_id' });
  });

  describe('entities', () => {
    const store = createEntitiesStore();

    it('should set the correct types', () => {
      store.pipe(selectAllEntities()).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<Todo[]>();
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
        expectTypeOf(v).toEqualTypeOf<Todo[]>();
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
      store.pipe(selectAllEntities({ ref: UIEntitiesRef })).subscribe((v) => {
        expectTypeOf(v).toEqualTypeOf<UITodo[]>();
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
        expectTypeOf(v).toEqualTypeOf<UITodo[]>();
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
