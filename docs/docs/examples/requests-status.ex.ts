import { createState, Store } from '@ngneat/elf';
import { withEntities, setEntities } from '@ngneat/elf-entities';
import {
  withRequestsStatus,
  selectRequestStatus,
  setRequestStatus,
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

fromFetch<Todo[]>('https://jsonplaceholder.typicode.com/todos', {
  selector: (response) => response.json(),
})
  .pipe(
    tap((todos) => setEntities(todos)),
    setRequestStatus(todosStore, 'todos')
  )
  .subscribe();
