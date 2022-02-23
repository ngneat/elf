import { createStore } from '@ngneat/elf';
import {
  addEntities,
  selectAll,
  selectEntities,
  selectEntity,
  UIEntitiesRef,
  unionEntities,
  withEntities,
  withUIEntities,
} from '@ngneat/elf-entities';

interface TodoUI {
  id: number;
  open: boolean;
}
interface Todo {
  id: number;
  name: string;
}

const todosStore = createStore(
  { name: 'todos' },
  withEntities<Todo>(),
  withUIEntities<TodoUI>()
);

todosStore.update(
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
  .pipe(unionEntities())
  .subscribe(console.log);
