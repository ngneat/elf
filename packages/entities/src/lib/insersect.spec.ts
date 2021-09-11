import { createState, Store } from '@ngneat/elf';
import { createTodo, Todo, UITodo } from '@ngneat/elf-mocks';
import { selectAll, selectEntities } from './all.query';
import { UIEntitiesRef, withEntities, withUIEntities } from './entity.state';
import { intersectEntities } from './intersect';
import { addEntities } from './add.mutation';
import { updateEntities } from './update.mutation';
import { expectTypeOf } from 'expect-type';

describe('intersectEntities', () => {
  it('should return intersection of ui and model', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withUIEntities<UITodo>()
    );

    const store = new Store({ state, name: 'todos', config });
    const spy = jest.fn();

    store
      .combine({
        entities: store.pipe(selectAll()),
        UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
      })
      .pipe(intersectEntities())
      .subscribe((v) => {
        spy(v);
        expectTypeOf(v).toEqualTypeOf<Array<Todo & UITodo>>();
      });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([]);

    store.reduce(
      addEntities(createTodo(1)),
      addEntities({ id: 1, open: false }, { ref: UIEntitiesRef })
    );

    expect(spy).toHaveBeenCalledTimes(2);

    expect(spy).toHaveBeenCalledWith([
      {
        ...createTodo(1),
        open: false,
      },
    ]);

    store.reduce(updateEntities(1, { open: true }, { ref: UIEntitiesRef }));

    expect(spy).toHaveBeenCalledTimes(3);

    expect(spy).toHaveBeenCalledWith([
      {
        ...createTodo(1),
        open: true,
      },
    ]);

    store.reduce(
      addEntities(createTodo(2)),
      addEntities({ id: 2, open: false }, { ref: UIEntitiesRef })
    );

    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith([
      {
        ...createTodo(1),
        open: true,
      },
      {
        ...createTodo(2),
        open: false,
      },
    ]);

    store.reduce(updateEntities(1, { title: 'baz' }));

    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenCalledWith([
      {
        ...{
          ...createTodo(1),
          title: 'baz',
        },
        open: true,
      },
      {
        ...createTodo(2),
        open: false,
      },
    ]);
  });
});
