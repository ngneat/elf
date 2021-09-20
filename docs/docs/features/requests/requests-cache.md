# Cache

Using this feature, you can manage the cache status of API calls in your store. First, you need to install the package by using the CLI command or npm:

```bash
npm i @ngneat/elf-requests
```

To use this feature, provides the `withRequestsCache` props factory function to `createState`:

```ts
import { createState, Store } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { withRequestsCache } from '@ngneat/elf-requests';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(
  withEntities<Todo>(),
  withRequestsCache()
);

const todosStore = new Store({ name: 'todos', state, config });
```

In your server call, you can use the `skipWhileCached` operator and pass a unique key to identify the request:

```ts
import { setRequestStatus } from '@ngneat/elf-requests';

http.get(todosUrl).pipe(
  tap((todos) => todosRepo.setEntities(todos)),
  skipWhileCached(todosRepo.store, 'todos')
);
```

This will ensure the `store` will have the cache status of the `todos` call listed as `full` in the store. You can also pass the `partial` status:

```ts
import { setRequestStatus } from '@ngneat/elf-requests';

http.get(todosUrl).pipe(
  tap((todos) => todosRepo.setEntities(todos)),
  skipWhileCached(todosRepo.store, 'todos', { value: 'partial' })
);
```

You can monitor and change the request cache status for your APIs using the following queries and mutations:

## Queries

### `selectRequestStatus`

Select the cache status of the provided request key:

```ts
import { selectRequestCache } from '@ngneat/elf-requests';

todosCacheStatus$ = store.pipe(selectRequestCache('todos'));
```

### `getRequestCache`

Get the cache status of the provided request key:

```ts
import { getRequestCache } from '@ngneat/elf-requests';

todosCacheStatus = store.query(getRequestCache('todos'));
```

### `selectIsRequestCached`

Select whether the cache status of the provided request key isn't `none`:

```ts
import { selectIsRequestCached } from '@ngneat/elf-requests';

isCached$ = store.pipe(selectIsRequestCached('todos'));
```

Get whether the cache status of the provided request key isn't `none`:

```ts
import { isRequestCached } from '@ngneat/elf-requests';

isCached = store.query(isRequestCached('todos'));
```

## Mutations

### `updateRequestStatus`

```ts
import { updateRequestCache } from '@ngneat/elf-requests';

store.reduce(updateRequestCache('todos'));
store.reduce(updateRequestCache('todos', 'partial'));
store.reduce(updateRequestCache('todos', 'none'));
```

And more:
`updateRequestsCache`, `resetRequestsCache`, `getRequestsCache`, `setRequestsCache`
