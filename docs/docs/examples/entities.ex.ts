import { createStore } from '@ngneat/elf';
import { selectAll, setEntities, withEntities } from '@ngneat/elf-entities';

interface Todo {
  id: number;
  label: string;
}

const todosStore = createStore({ name: 'todos' }, withEntities<Todo>());

todosStore.pipe(selectAll()).subscribe((todos) => {
  console.log(todos);
});

todosStore.update(
  setEntities([
    { id: 1, label: 'one ' },
    { id: 2, label: 'two' },
  ])
);
