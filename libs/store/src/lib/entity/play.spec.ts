import { createState } from '../core/state';
import { entitiesUIRef, withEntities, withUIEntities } from './entity.state';
import { createTodo, Todo } from '../mocks/stores.mock';
import { Store } from '../core/store';
import produce from 'immer';
import { withProps } from '../props/props.state';
import { addEntity } from './add.mutation';
import { select } from '../core/queries';
import { selectAll } from './all.query';
import { updateEntity } from './update.mutation';

type UIEntity = { id: number; open: boolean };

const { state, config } = createState(
  withEntities<Todo, Todo['id']>(),
  withUIEntities<UIEntity, Todo['id']>(),
  withProps<{ id: number; skills: { title: string }[] }>({ id: 1, skills: [] })
);

const store = new Store({ state, name: 'todos', config });

function change<S>(updater: (state: S) => void): (state: S) => S {
  return function(state: S) {
    return produce(state, draft => {
      updater(draft as S);
    });
  };
}

it('', function() {
   store.pipe(select(state => state.id )).subscribe(console.log);

   store.reduce(
     change(state => {
       state.id = 1;
     })
   )
  });

it('sho', function() {

  store.reduce(
    change(state => {
      state.id = 3;
    }),
    addEntity(createTodo(1)),
    addEntity({ open: true, id: 1 }, { ref: entitiesUIRef })
  );

  store.combine([
    store.pipe(selectAll()),
    store.pipe(selectAll({ ref: entitiesUIRef }))
  ]).subscribe(v => {
    console.log(v);
  });

  store.pipe(select(state => state.skills[0])).subscribe(v => {
    console.log('0', v?.title);
  });

  store.pipe(select(state => state.skills[1])).subscribe(v => {
    console.log('1', v?.title);
  });

  store.reduce(
    change(state => {
      state.skills.push({ title: 'foo' });
      state.skills.push({ title: 'bar' });
    }),
    addEntity(createTodo(2)),
    addEntity({ open: true, id: 2 }, { ref: entitiesUIRef }),
    updateEntity(1, change<Todo>(entity => {
      entity.title = 'd';
    }))
  );

  console.log(store.getValue());
});
