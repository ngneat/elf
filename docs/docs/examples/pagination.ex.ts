import { createState, Store } from '@ngneat/elf';
import { withEntities, addEntities } from '@ngneat/elf-entities';
import {
  withPagination,
  updatePaginationData,
  setPage,
} from '@ngneat/elf-pagination';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(withEntities<Todo>(), withPagination());

const todosStore = new Store({ name: 'todos', state, config });

export function addTodos(todos: Todo[]) {
  todosStore.reduce(
    addEntities(todos),
    updatePaginationData({
      currentPage: 1,
      perPage: 10,
      total: 96,
      lastPage: 10,
    }),
    setPage(
      1,
      todos.map((c) => c.id)
    )
  );
}

todosStore.subscribe(console.log);

addTodos([{ id: 1, label: 'one' }]);
