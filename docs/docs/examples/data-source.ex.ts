import { createStore } from '@ngneat/elf';
import {
  selectAllEntities,
  setEntities,
  withEntities,
} from '@ngneat/elf-entities';
import {
  createRequestDataSource,
  withRequestsStatus,
} from '@ngneat/elf-requests';
import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';

interface Todo {
  id: number;
  label: string;
}

const store = createStore(
  { name: 'todos' },
  withEntities<Todo>(),
  withRequestsStatus()
);

const dataSource = createRequestDataSource({
  store,
  data$: () => store.pipe(selectAllEntities()),
  requestKey: 'todos',
  dataKey: 'todos',
  idleAsPending: true,
});

function setTodos(todos: Todo[]) {
  store.update(setEntities(todos), dataSource.setSuccess());
}

dataSource.data$().subscribe((data) => {
  console.log(data);
});

// todos.service.ts
function fecthTodos() {
  return fromFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
    selector: (response) => response.json(),
  }).pipe(tap(setTodos), dataSource.trackRequestStatus());
}

fecthTodos().subscribe();
