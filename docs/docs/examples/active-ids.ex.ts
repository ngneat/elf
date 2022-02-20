import { createStore } from '@ngneat/elf';
import {
  addEntities,
  selectActiveEntity,
  setActiveId,
  withActiveId,
  withEntities,
} from '@ngneat/elf-entities';

interface Todo {
  id: number;
  label: string;
}

const todosStore = createStore(
  { name: 'todos' },
  withEntities<Todo>(),
  withActiveId()
);

todosStore.pipe(selectActiveEntity()).subscribe((active) => {
  console.log(active);
});

todosStore.update(addEntities({ id: 1, label: 'one' }), setActiveId(1));
