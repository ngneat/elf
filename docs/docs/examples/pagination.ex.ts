import { createStore } from '@ngneat/elf';
import { addEntities, withEntities } from '@ngneat/elf-entities';
import {
  setPage,
  updatePaginationData,
  withPagination,
} from '@ngneat/elf-pagination';

interface Todo {
  id: number;
  label: string;
}

const todosStore = createStore(
  { name: 'todos' },
  withEntities<Todo>(),
  withPagination()
);

export function addTodos(todos: Todo[]) {
  todosStore.update(
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
