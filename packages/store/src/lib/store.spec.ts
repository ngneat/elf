import { createTodo, createUITodo, Todo } from '@ngneat/elf-mocks';
import {
  addEntities,
  selectAll,
  updateEntities,
  withEntities,
  withUIEntities,
  UIEntitiesRef,
} from '@ngneat/elf-entities';
import { withProps } from './props.state';
import { Store } from './store';
import { createState } from './state';

type UIEntity = { id: number; open: boolean };

describe('store', () => {
  it('should reset store', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withProps<{ filter: string }>({ filter: '' })
    );

    const store = new Store({ state, name: 'todos', config });

    store.reduce(addEntities(createTodo(1)), (state) => ({
      ...state,
      filter: 'foo',
    }));

    expect(store.getValue()).toMatchSnapshot();

    store.reset();

    expect(store.getValue()).toMatchSnapshot();
  });

  it('should combine and fire only once', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withUIEntities<UIEntity>(),
      withProps<{ filter: string }>({ filter: '' })
    );

    const store = new Store({ state, name: 'todos', config });

    const spy = jest.fn();

    store
      .combine({
        todos: store.pipe(selectAll()),
        ui: store.pipe(selectAll({ ref: UIEntitiesRef })),
      })
      .subscribe(spy);

    expect(spy).toHaveBeenCalledTimes(1);

    expect(store.getValue()).toMatchSnapshot();

    store.reduce(
      addEntities(createTodo(1)),
      addEntities(createUITodo(1), { ref: UIEntitiesRef })
    );

    expect(spy).toHaveBeenCalledTimes(2);
    expect(store.getValue()).toMatchSnapshot();

    store.reduce((state) => ({ ...state, filter: 'foo' }));

    // Update non related value should not call `next`
    expect(spy).toHaveBeenCalledTimes(2);

    store.reduce(updateEntities(1, { title: 'foo' }), (state) => ({
      ...state,
      filter: 'hello',
    }));

    expect(store.getValue()).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(3);
  });
});
