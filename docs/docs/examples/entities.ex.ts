import { createState, Store } from '@ngneat/elf';
import { withEntities, setEntities, selectAll } from '@ngneat/elf-entities';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(withEntities<Todo>());

const todosStore = new Store({ name: 'todos', state, config });

todosStore.pipe(selectAll()).subscribe((todos) => {
  console.log(todos);
});

todosStore.reduce(
  setEntities([
    { id: 1, label: 'one ' },
    { id: 1, label: 'two' },
  ])
);
