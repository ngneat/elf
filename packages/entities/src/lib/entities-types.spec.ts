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
} from '@ngneat/elf-entities';
import { expectTypeOf } from 'expect-type';

describe('Entities Types', () => {
  describe('entities', () => {
    const store = createEntitiesStore();

    it('should set the correct types', () => {
      store.pipe(selectAll()).subscribe((v) => {
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
        store.reduce(
          // @ts-expect-error - We don't have withUIEntities
          addEntities(
            { id: 1, title: '', completed: true },
            { ref: UIEntitiesRef }
          )
        );

        // @ts-expect-error - We didn't provide the complete entity
        store.reduce(addEntities({ id: 1 }));

        store.reduce(
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
        store.reduce(addEntities({ id: 1 }, { ref: UIEntitiesRef }));

        store.reduce(
          // @ts-expect-error - We provide an additional property that doesn't exists
          addEntities({ id: 1, open: true, foo: 1 }, { ref: UIEntitiesRef })
        );
      } catch {
        //
      }
    });
  });
});
