import { createStore } from '@ngneat/elf';
import { setEntities, withEntities } from '@ngneat/elf-entities';
import {
  createRequestsCacheOperator,
  selectRequestCache,
  updateRequestCache,
  withRequestsCache,
} from '@ngneat/elf-requests';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';

interface Todo {
  id: number;
  label: string;
}

const todosStore = createStore(
  { name: 'todos' },
  withEntities<Todo>(),
  withRequestsCache<'todos'>()
);

const skipWhileTodosCached = createRequestsCacheOperator(todosStore);

export function setTodos(todos: Todo[]) {
  todosStore.update(updateRequestCache('todos'), setEntities(todos));
}

todosStore.pipe(selectRequestCache('todos')).subscribe((status) => {
  console.log(status);
});

function fetchTodos() {
  return fromFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
    selector: (response) => response.json(),
  }).pipe(tap(setTodos), skipWhileTodosCached('todos'));
}

fetchTodos().subscribe(() => console.log('fetched'));

// Use `setTimeout` to simulate a later call
setTimeout(() => {
  fetchTodos().subscribe(() => console.log('You should not see me'));
}, 1000);
