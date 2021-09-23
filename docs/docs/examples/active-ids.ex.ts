import { createState, Store } from '@ngneat/elf';
import {
  withEntities,
  withActiveId,
  selectActiveEntity,
  addEntities,
  setActiveId,
} from '@ngneat/elf-entities';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(withEntities<Todo>(), withActiveId());

const todosStore = new Store({ name: 'todos', state, config });

todosStore.pipe(selectActiveEntity()).subscribe((active) => {
  console.log(active);
});

todosStore.reduce(addEntities({ id: 1, label: 'one' }), setActiveId(1));
