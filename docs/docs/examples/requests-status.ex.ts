import { createState, Store } from '@ngneat/elf';
import { withEntities, setEntities } from '@ngneat/elf-entities';
import {
  withRequestsStatus,
  selectRequestStatus,
  setRequestStatus,
  updateRequestStatus,
} from '@ngneat/elf-requests';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(
  withEntities<Todo>(),
  withRequestsStatus()
);

const todosStore = new Store({ name: 'todos', state, config });

todosStore.pipe(selectRequestStatus('todos')).subscribe((status) => {
  console.log(status);
});

function setTodos(todos: Todo[]) {
  todosStore.update(
    setEntities(todos),
    updateRequestStatus('todos', 'success')
  );
}

// todos.service.ts

function fecthTodos() {
  return fromFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
    selector: (response) => response.json(),
  }).pipe(tap(setTodos), setRequestStatus(todosStore, 'todos'));
}

setTimeout(() => {
  fecthTodos().subscribe();
}, 2000);
