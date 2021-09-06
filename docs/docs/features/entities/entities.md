# Entities

This feature enables the store to act as an entities store. You can think of `entities` state as a table in a database, where each table represents a flat collection of entities. Elf's entities state simplifies the process, giving you everything you need to manage it.

First, you need to install it by using the CLI command or npm:

```bash
npm i @ngneat/elf-entities
```

To use this feature, provides the `withEntities` props factory function to `createState`:

```ts
import { createState, Store } from '@ngneat/elf';
import { addEntities } from '@ngneat/elf-entities';

interface Todo {
  id: number;
  label: string;
}

const { state, config } = createState(withEntities<Todo>());

const todosStore = new Store({ name: 'todos', state, config });
```

This will allow you to use the following ready-made mutations and queries:

### Queries

#### `selectAll`

Select the entire store's entity collection:

```ts
import { selectAll } from '@ngneat/elf-entities';

const todos$ = todosStore.pipe(selectAll())
```


### Mutations


#### `addEntities`

Select the entire store's entity collection:

```ts
import { addEntities } from '@ngneat/elf-entities';

todosStore.reduce(addEntities(todo));
todosStore.reduce(addEntities([ todo, todo ]));
```



Simply import the ones you need from the library. Similarly, you can query the store with the `getEntity` or `selectEntity`
query methods (the former returns the value based on the id/predicate, the latter - an Observable).
