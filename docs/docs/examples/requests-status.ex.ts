import { createStore } from '@ngneat/elf';
import { setEntities, withEntities } from '@ngneat/elf-entities';
import {
  createRequestsStatusOperator,
  selectRequestStatus,
  updateRequestStatus,
  withRequestsStatus,
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
  withRequestsStatus<'todos'>()
);

const trackTodosRequestsStatus = createRequestsStatusOperator(todosStore);

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
  }).pipe(tap(setTodos), trackTodosRequestsStatus('todos'));
}

setTimeout(() => {
  fecthTodos().subscribe();
}, 2000);
