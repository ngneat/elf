import { createState, Store } from '@ngneat/elf';
import { withEntities, setEntities } from '@ngneat/elf-entities';
import {
  withRequestsCache,
  updateRequestCache,
  selectRequestCache,
  skipWhileCached,
} from '@ngneat/elf-requests';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(
  withEntities<Todo>(),
  withRequestsCache()
);

const todosStore = new Store({ name: 'todos', state, config });

export function setTodos(todos: Todo[]) {
  todosStore.reduce(updateRequestCache('todos'), setEntities(todos));
}

todosStore.pipe(selectRequestCache('todos')).subscribe((status) => {
  console.log(status);
});

function fetchTodos() {
  return fromFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
    selector: (response) => response.json(),
  }).pipe(
    tap((todos) => setTodos(todos)),
    skipWhileCached(todosStore, 'todos')
  );
}

fetchTodos().subscribe(() => console.log('fetched'));

// Use `setTimeout` to simulate a later call
setTimeout(() => {
  fetchTodos().subscribe(() => console.log('You should not see me'));
}, 1000);
