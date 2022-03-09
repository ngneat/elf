import { createState, Store } from '@ngneat/elf';
import { createTodo, Todo, UITodo } from '@ngneat/elf-mocks';
import { selectAllEntities, selectEntities } from './all.query';
import { UIEntitiesRef, withEntities, withUIEntities } from './entity.state';
import { unionEntities } from './union-entities';
import { addEntities } from './add.mutation';
import { updateEntities } from './update.mutation';
import { expectTypeOf } from 'expect-type';

describe('unionEntities', () => {
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
      .pipe(unionEntities())
      .subscribe((v) => {
        spy(v);
        expectTypeOf(v).toEqualTypeOf<Array<Todo & UITodo>>();
      });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith([]);

    store.update(
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

    store.update(updateEntities(1, { open: true }, { ref: UIEntitiesRef }));

    expect(spy).toHaveBeenCalledTimes(3);

    expect(spy).toHaveBeenCalledWith([
      {
        ...createTodo(1),
        open: true,
      },
    ]);

    store.update(
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

    store.update(updateEntities(1, { title: 'baz' }));

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
