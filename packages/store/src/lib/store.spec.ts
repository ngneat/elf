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
  describe('combine', () => {
    const { state, config } = createState(
      withEntities<Todo>(),
      withUIEntities<UIEntity>(),
      withProps<{ filter: string }>({ filter: '' })
    );

    const store = new Store({ state, name: 'todos', config });

    it('should fire only once', () => {
      const spy = jest.fn();

      store
        .combine({
          todos: store.pipe(selectAll()),
          ui: store.pipe(selectAll({ ref: UIEntitiesRef })),
        })
        .subscribe(spy);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(store.state).toMatchSnapshot();

      store.reduce(
        addEntities(createTodo(1)),
        addEntities(createUITodo(1), { ref: UIEntitiesRef })
      );

      expect(spy).toHaveBeenCalledTimes(2);
      expect(store.state).toMatchSnapshot();

      store.reduce((state) => ({ ...state, filter: 'foo' }));

      // Update non related value should not call `next`
      expect(spy).toHaveBeenCalledTimes(2);

      store.reduce(updateEntities(1, { title: 'foo' }), (state) => ({
        ...state,
        filter: 'hello',
      }));

      expect(store.state).toMatchSnapshot();
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });
});
