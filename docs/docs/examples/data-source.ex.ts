import { createState, Store } from '@ngneat/elf';
import {
  withRequestsStatus,
  selectRequestStatus,
  createRequestDataSource,
  updateRequestStatus,
} from '@ngneat/elf-requests';
import { selectAll, withEntities, addEntities } from '@ngneat/elf-entities';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(
  withEntities<Todo>(),
  withRequestsStatus()
);

const store = new Store({ state, config, name: '' });

const todos$ = store.pipe(selectAll());
const status$ = store.pipe(selectRequestStatus('todos'));

export const todosDataSource$ = createRequestDataSource({
  data$: todos$,
  status$,
  store,
});

todosDataSource$.subscribe((value) => {
  console.log(value);
});

setTimeout(() => {
  store.update(
    updateRequestStatus('todos', 'success'),
    addEntities({ id: 1, label: 'one' })
  );
}, 1000);
