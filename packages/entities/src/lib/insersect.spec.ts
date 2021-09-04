import { createState, Store } from '@ngneat/elf';
import { createTodo, Todo } from '@ngneat/elf-mocks';
import { tap } from 'rxjs/operators';
import { selectAll, selectEntities } from './all.query';
import { UIEntitiesRef, withEntities, withUIEntities } from './entity.state';
import { intersectEntities } from './intersect';
import { addEntities } from './add.mutation';
import { updateEntities } from './update.mutation';

describe('intersectEntities', () => {
  it('should return intersection of ui and model', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withUIEntities<{ id: Todo['id']; open: boolean }>()
    );

    const store = new Store({ state, name: 'todos', config });
    const spy = jest.fn();

    store
      .combine({
        entities: store.pipe(selectAll()),
        UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
      })
      .pipe(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        tap((v) => {
          //
        }),
        intersectEntities()
      )
      .subscribe((v) => {
        spy(v);
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
