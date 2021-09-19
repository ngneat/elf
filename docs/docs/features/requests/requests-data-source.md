# Data Source

With the `createRequestDataSource` function, we can easily select the state of an async request from our store:

```ts
import { createState, Store } from '@ngneat/elf';
import {
  withRequestsStatus,
  selectRequestStatus,
  // highlight-next-line
  createRequestDataSource,
} from '@ngneat/elf-requests';
import { selectAll, withEntities } from '@ngneat/elf-entities';

const { state, config } = createState(
  withEntities<Todo>(),
  withRequestsStatus()
);

const store = new Store({ state, config, name: '' });

const todos$ = store.pipe(selectAll());
const status$ = store.pipe(selectRequestStatus('todos'));

// highlight-start
export const todosDataSource$ = createRequestDataSource({
  data$: todos$,
  status$,
});
// highlight-end
```

The `todosDataSource$` will return an observable with the following type:

```ts
{
  data: Todo[];
  loading: boolean;
  error: unknown;
}
```

We can also pass the `dataKey` option to change the default `data` property name:

```ts
export const todosDataSource$ = createRequestDataSource({
  // highlight-next-line
  dataKey: 'todos',
  data$: todos$,
  status$,
});

// Now the response will be typed as:
{
  // highlight-next-line
  todos: Todo[];
  loading: boolean;
  error: unknown;
}
```
