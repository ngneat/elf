import { fromFetch } from 'rxjs/fetch';
import { tap } from 'rxjs/operators';
import { createState, Store } from '@ngneat/elf';
import {
  withRequestsStatus,
  createRequestDataSource,
} from '@ngneat/elf-requests';
import { withEntities, selectAll, setEntities } from '@ngneat/elf-entities';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(
  withEntities<Todo>(),
  withRequestsStatus()
);

const store = new Store({ state, config, name: 'todos' });

const dataSource = createRequestDataSource({
  store,
  data$: () => store.pipe(selectAll()),
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
