import { createState, Store } from '@ngneat/elf';
import {
  withEntities,
  withUIEntities,
  addEntities,
  UIEntitiesRef,
  selectEntity,
  selectAll,
  selectEntities,
  intersectEntities,
} from '@ngneat/elf-entities';

interface TodoUI {
  id: number;
  open: boolean;
}
interface Todo {
  id: number;
  name: string;
}

const { state, config } = createState(
  withEntities<Todo>(),
  withUIEntities<TodoUI>()
);

const todosStore = new Store({ name: 'todos', state, config });

todosStore.reduce(
  addEntities({ id: 1, name: 'foo' }),
  addEntities({ id: 1, open: true }, { ref: UIEntitiesRef })
);

todosStore.pipe(selectEntity(1, { ref: UIEntitiesRef })).subscribe((todo) => {
  console.log(todo);
});

todosStore
  .combine({
    entities: todosStore.pipe(selectAll()),
    UIEntities: todosStore.pipe(selectEntities({ ref: UIEntitiesRef })),
  })
  .pipe(intersectEntities())
  .subscribe(console.log);
