import { createTodo, createUITodo, Todo } from '../mocks/stores.mock';
import {
  addEntities,
  selectAll,
  updateEntities,
  withEntities,
  withUIEntities,
} from '../entities';
import { withProps } from '../props/props.state';
import { Store } from './store';
import { entitiesUIRef } from '../entities/entity.state';
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
        .combine([
          store.pipe(selectAll()),
          store.pipe(selectAll({ ref: entitiesUIRef })),
        ])
        .subscribe(spy);

      expect(spy).toHaveBeenCalledTimes(1);

      expect(store.state).toMatchSnapshot();

      store.reduce(
        addEntities(createTodo(1)),
        addEntities(createUITodo(1), { ref: entitiesUIRef })
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
