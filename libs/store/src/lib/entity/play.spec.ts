import { createState } from '../core/state';
import { withEntities, withUIEntities } from './entity.state';
import { Todo } from '../mocks/stores.mock';
import { Store } from '../core/store';
import { withProps } from '../props/props.state';
import { increment } from '../mutations/increment.mutation';

type UIEntity = { id: number; open: boolean };

const { state, config } = createState(
  withEntities<Todo, Todo['id']>(),
  withUIEntities<UIEntity, Todo['id']>(),
  withProps<{ count: number }>({ count: 0 }),
  withProps<{ a?: { v: number } }>({ a: { v: 0 } })

);

const store = new Store({ state, name: 'todos', config });

it('sho', function() {
  store.reduce(
    increment(state => state),
    state => ({
      ...state,
      count: increment(state.count, { limit: 3 })
    })
  )
  // store.combine([
  //   store.pipe(selectAll()),
  //   store.pipe(selectAll({ ref: entitiesUIRef }))
  // ]).subscribe(v => {
  //   console.log(v);
  // });
  //
  // store.reduce(
  //   addEntity(createTodo(1)),
  //   addEntity({ open: true, id: 1 }, { ref: entitiesUIRef })
  // );
  //
  // store.reduce(addEntity(createTodo(3)));
  // store.reduce(setActive(1));

  console.log(store.getValue());
});
