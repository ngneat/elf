import { createState } from '../core/state';
import { entitiesUIRef, withEntities, withUIEntities } from './entity.state';
import { createTodo, Todo } from '../mocks/stores.mock';
import { Store } from '@eleanor/store';
import { addEntity } from './add.mutation';
import { combineLatest } from 'rxjs';
import { selectAll } from './all.query';

type UIEntity = { id: number; open: boolean };

const { state, config } = createState(
  withEntities<Todo, Todo['id']>(),
  withUIEntities<UIEntity, number>()
);

const store = new Store({ state, name: 'todos', config });

it('sho', function() {
  combineLatest([
    store.pipe(selectAll()),
    store.pipe(selectAll({ ref: entitiesUIRef }))
  ]).subscribe(v => {
    console.log(v);
  })

  store.reduce(
    addEntity(createTodo(1)),
    addEntity({ open: true, id: 1 }, { ref: entitiesUIRef })
  );

  // console.log(store.getValue());
});
