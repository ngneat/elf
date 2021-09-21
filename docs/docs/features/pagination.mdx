# Pagination

In many cases - for example, when working with very large data-sets - we don't want to work with the full collection in memory. Instead server-side paging is used, where the server sends just a single page at a time.

Usually, we also want to cache pages that already have been fetched, in order to spare the need for an additional request.

:::info
This feature requires `@ngneat/elf-entities`
:::

Using this feature, you can manage pagination by using the store. First, you need to install the package by using the CLI command or npm:

```bash
npm i @ngneat/elf-pagination
```

To use this feature, provides the `withPagination` props factory function to `createState`:

```ts
import { createState, Store } from '@ngneat/elf';
import { withEntities } from '@ngneat/elf-entities';
import { withPagination } from '@ngneat/elf-pagination';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(withEntities<Todo>(), withPagination());

const todosStore = new Store({ name: 'todos', state, config });
```

Call `updatePaginationData()` with a configuration object that determines the various pagination settings, and call `setPage()` whenever you want to define the `ids` that belong to a certain page number.

```ts
todosStore.reduce(
  addEntities(todos),
  updatePaginationData({
    currentPage: 1,
    perPage: 10,
    total: 96,
    lastPage: 10,
  }),
  setPage(
    1,
    data.map((c) => c.id)
  )
);
```

In your server calls, you can use the `skipWhilePageExists` operator, which enables you to skip server calls
if the page exists in the store:

```ts
import { skipWhilePageExists } from '@ngneat/elf-pagination';

http.get(todosUrl).pipe(
  tap((todos) => todosRepo.setEntities(todos)),
  skipWhilePageExists(1)
);
```

Additional queries and mutations available are:

## Queries

### `selectCurrentPageEntities`

Select the current page entities:

```ts
import { selectCurrentPageEntities } from '@ngneat/elf-pagination';

todos$ = store.pipe(selectCurrentPageEntities());
```

### `selectCurrentPageEntities`

Select the current page number (by default it's page 1):

```ts
import { selectCurrentPage } from '@ngneat/elf-pagination';

currentPage$ = store.pipe(selectCurrentPage());
```

### `selectHasPage`

Select whether the page exists:

```ts
import { selectHasPage } from '@ngneat/elf-pagination';

hasPage$ = store.pipe(selectHasPage(1));
```

### `hasPage`

Get whether the page exists:

```ts
import { hasPage } from '@ngneat/elf-pagination';

hasPage = store.query(hasPage(1));
```

### `selectPaginationData`

Select the pagination data:

```ts
import { selectPaginationData } from '@ngneat/elf-pagination';

data$ = store.pipe(selectPaginationData());
```

### `getPaginationData`

Get pagination data:

```ts
import { getPaginationData } from '@ngneat/elf-pagination';

data = store.query(getPaginationData());
```

## Mutations

### `setCurrentPage`

Set the current page:

```ts
import { setCurrentPage } from '@ngneat/elf-pagination';

store.reduce(setCurrentPage(2));
```

### `setPage`

Set the ids belongs to a page:

```ts
import { setPage } from '@ngneat/elf-pagination';

store.reduce(setPage(2, [id, id, id]));
```

### `updatePaginationData`

Set the current page:

```ts
import { updatePaginationData } from '@ngneat/elf-pagination';

store.reduce(
  updatePaginationData({
    currentPage: 1,
    perPage: 10,
    total: 96,
    lastPage: 10,
  })
);
```

### `deletePage`

Delete a page:

```ts
import { deletePage } from '@ngneat/elf-pagination';

store.reduce(deletePage(2));
```

### `deleteAllPages`

Delete all pages:

```ts
import { deleteAllPages } from '@ngneat/elf-pagination';

store.reduce(deleteAllPages(2));
```
