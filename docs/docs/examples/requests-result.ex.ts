import { createStore } from '@ngneat/elf';
import {
  setEntities,
  withEntities,
  selectAllEntities,
} from '@ngneat/elf-entities';
import { joinRequestResult, trackRequestResult } from '@ngneat/elf-requests';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs';

interface Todo {
  id: number;
  label: string;
}

const store = createStore({ name: 'todos' }, withEntities<Todo>());

const entities$ = store.pipe(selectAllEntities(), joinRequestResult(['todos']));

entities$.subscribe((result) => {
  console.log(result);
});

function setTodos(todos: Todo[]) {
  store.update(setEntities(todos));
}

// todos.service.ts
function fecthTodos() {
  return fromFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
    selector: (response) => response.json(),
  }).pipe(tap(setTodos), trackRequestResult(['todos']));
}

setTimeout(() => {
  fecthTodos().subscribe();
}, 2000);

setTimeout(() => {
  fecthTodos().subscribe();
}, 4000);
