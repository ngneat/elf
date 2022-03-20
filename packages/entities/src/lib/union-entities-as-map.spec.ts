import { createState, Store } from '@ngneat/elf';
import {
  addEntities,
  selectAllEntities,
  selectEntities,
  UIEntitiesRef,
  unionEntitiesAsMap,
  updateEntities,
  withEntities,
  withUIEntities,
} from '@ngneat/elf-entities';
import { createTodo, Todo, UITodo } from '@ngneat/elf-mocks';
import { expectTypeOf } from 'expect-type';

describe('unionEntitiesAsMap', () => {
  it('should return intersection of ui and model', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withUIEntities<UITodo>()
    );

    const store = new Store({ state, name: 'todos', config });
    const spy = jest.fn();

    store
      .combine({
        entities: store.pipe(selectAllEntities()),
        UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
      })
      .pipe(unionEntitiesAsMap())
      .subscribe((v) => {
        spy(v);
        expectTypeOf(v).toEqualTypeOf<Record<number, Todo & UITodo>>();
      });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith({});

    store.update(
      addEntities(createTodo(1)),
      addEntities({ id: 1, open: false }, { ref: UIEntitiesRef })
    );

    expect(spy).toHaveBeenCalledTimes(2);

    expect(spy).toHaveBeenCalledWith({
      1: {
        ...createTodo(1),
        open: false,
      },
    });

    store.update(updateEntities(1, { open: true }, { ref: UIEntitiesRef }));

    expect(spy).toHaveBeenCalledTimes(3);

    expect(spy).toHaveBeenCalledWith({
      1: {
        ...createTodo(1),
        open: true,
      },
    });

    store.update(
      addEntities(createTodo(2)),
      addEntities({ id: 2, open: false }, { ref: UIEntitiesRef })
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith({
      1: {
        ...createTodo(1),
        open: true,
      },
      2: {
        ...createTodo(2),
        open: false,
      },
    });

    store.update(updateEntities(1, { title: 'baz' }));

    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenCalledWith({
      1: {
        ...{
          ...createTodo(1),
          title: 'baz',
        },
        open: true,
      },
      2: {
        ...createTodo(2),
        open: false,
      },
    });
  });
});
