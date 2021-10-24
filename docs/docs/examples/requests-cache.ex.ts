import { createState, Store } from '@ngneat/elf';
import { withEntities, setEntities } from '@ngneat/elf-entities';
import {
  withRequestsCache,
  updateRequestCache,
  selectRequestCache,
  createRequestsCacheOperator,
} from '@ngneat/elf-requests';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(
  withEntities<Todo>(),
  withRequestsCache<'todos'>()
);

const todosStore = new Store({ name: 'todos', state, config });
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
