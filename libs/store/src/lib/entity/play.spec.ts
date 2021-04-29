import { createState } from '../core/state';
import { entitiesUIRef, withEntities, withUIEntities } from './entity.state';
import { createTodo, Todo } from '../mocks/stores.mock';
import { Store } from '@eleanor/store';
import { addEntity } from './add.mutation';
import { selectAll } from './all.query';
import { withActive } from '../active/active.state';
import { setActive } from '../active/active.mutation';

type UIEntity = { id: number; open: boolean };

const { state, config } = createState(
  withEntities<Todo, Todo['id']>(),
  withActive<Todo['id']>(),
  withUIEntities<UIEntity, number>()
);

const store = new Store({ state, name: 'todos', config });

it('sho', function() {

  store.combine([
    store.pipe(selectAll()),
    store.pipe(selectAll({ ref: entitiesUIRef }))
  ]).subscribe(v => {
    console.log(v);
  });

  store.reduce(
    addEntity(createTodo(1)),
    addEntity({ open: true, id: 1 }, { ref: entitiesUIRef })
  );

  store.reduce(addEntity(createTodo(3)));
  store.reduce(setActive(1));


  console.log(store.getValue());
});
