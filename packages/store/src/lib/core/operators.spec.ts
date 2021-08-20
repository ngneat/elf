import { BehaviorSubject, of } from 'rxjs';
import {
  distinctUntilArrayItemChanged,
  head,
  intersectEntities,
  select,
} from './operators';
import { selectAll, selectEntities } from '../entities/all.query';
import {
  UIEntitiesRef,
  withEntities,
  withUIEntities,
} from '../entities/entity.state';
import { tap } from 'rxjs/operators';
import { createTodo, Todo } from '../mocks/stores.mock';
import { addEntities, updateEntities } from '../entities';
import { Store } from './store';
import { createState } from './state';

describe('select', () => {
  it('should work', () => {
    const data = {
      foo: 1,
    };

    const source = new BehaviorSubject(data);
    const spy = jest.fn();

    source
      .asObservable()
      .pipe(select((state) => state.foo))
      .subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(1);

    source.next({ foo: 1 });

    expect(spy).toHaveBeenCalledTimes(1);

    source.next({ foo: 2 });
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith(2);
  });
});

describe('distinctUntilArrayItemChanged', () => {
  it('should work', () => {
    const data: any[] = [];
    const source = new BehaviorSubject(data);

    const s$ = source.asObservable().pipe(distinctUntilArrayItemChanged());
    const spy = jest.fn();

    s$.subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);

    // Same instance
    source.next(data);
    expect(spy).toHaveBeenCalledTimes(1);

    // Change length
    const item = { id: 1 };
    source.next([item]);
    expect(spy).toHaveBeenCalledTimes(2);

    // Different array ref with same item ref
    source.next([item]);
    expect(spy).toHaveBeenCalledTimes(2);

    // Update item
    source.next([{ id: 2 }]);
    expect(spy).toHaveBeenCalledTimes(3);

    // One more item
    source.next([{ id: 2 }, { id: 3 }]);
    expect(spy).toHaveBeenCalledTimes(4);
  });
});

describe('head', () => {
  it('should return the first item', () => {
    of([1])
      .pipe(head())
      .subscribe((v) => {
        expect(v).toBe(1);
      });
  });
});

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
