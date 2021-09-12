# Entities

This feature enables the store to act as an entities store. You can think of `entities` state as a table in a database,
where each table represents a flat collection of entities. Elf's entities state simplifies the process, giving you
everything you need to manage it.

First, you need to install the package by using the CLI command or npm:

```bash
npm i @ngneat/elf-entities
```

To use this feature, provides the `withEntities` props factory function to `createState`:

```ts
import { createState, Store } from '@ngneat/elf';
import { addEntities, withEntities } from '@ngneat/elf-entities';

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

const todos$ = todosStore.pipe(selectAll());
```

#### `selectAllApply`

Select the entire store's entity collection, and apply a `filter/map`:

```ts
import { selectAllApply } from '@ngneat/elf-entities';

const titles$ = todosStore.pipe(
  selectAllApply({
    mapEntity: (e) => e.title,
    filterEntity: (e) => e.completed,
  })
);
```

In the above example, it'll first apply the `filter` and then the `map` function.

#### `selectEntities`

Select the entire store's entity collection as object:

```ts
import { selectEntities } from '@ngneat/elf-entities';

const todos$ = todosStore.pipe(selectEntities());
```

#### `selectEntity`

Select an entity or a slice of an entity:

```ts
import { selectEntity } from '@ngneat/elf-entities';

const todo$ = todosStore.pipe(selectEntity(id));
const title$ = todosStore.pipe(selectEntity(id, { pluck: 'title' }));
const title$ = todosStore.pipe(selectEntity(id, { pluck: (e) => e.title }));
```

#### `selectMany`

Select multiple entities from the store:

```ts
import { selectMany } from '@ngneat/elf-entities';

const todos$ = todosStore.pipe(selectMany([id, id]));
const titles$ = todosStore.pipe(selectMany(id, { pluck: 'title' }));
const titles$ = todosStore.pipe(selectMany(id, { pluck: (e) => e.title }));
```

#### `selectFirst`

Select the first entity from the store:

```ts
import { selectFirst } from '@ngneat/elf-entities';

const first$ = todosStore.pipe(selectFirst());
```

#### `selectLast`

Select the last entity from the store:

```ts
import { selectLast } from '@ngneat/elf-entities';

const last$ = todosStore.pipe(selectLast());
```

#### `selectEntitiesCount`

Select the store's entity collection size:

```ts
import { selectEntitiesCount } from '@ngneat/elf-entities';

const count$ = todosStore.pipe(selectEntitiesCount());
```

#### `selectEntitiesCountByPredicate`

Select the store's entity collection size:

```ts
import { selectEntitiesCountByPredicate } from '@ngneat/elf-entities';

const count$ = todosStore.pipe(
  selectEntitiesCountByPredicate((entity) => entity.completed)
);
```

#### `getEntity`

Get an entity by id:

```ts
import { getEntity } from '@ngneat/elf-entities';

const todo = todosStore.query(getEntity(id));
```

#### `hasEntity`

Returns whether an entity exists:

```ts
import { hasEntity } from '@ngneat/elf-entities';

if (todosStore.query(hasEntity(id))) {
}
```

### Mutations

#### `setEntities`

Replace current collection with the provided collection:

```ts
import { setEntities } from '@ngneat/elf-entities';

todosStore.reduce(setEntities([todo, todo]));
```

#### `addEntities`

Add an entity or entities to the store:

```ts
import { addEntities } from '@ngneat/elf-entities';

todosStore.reduce(addEntities(todo));
todosStore.reduce(addEntities([todo, todo]));
todosStore.reduce(addEntities([todo, todo], { prepend: true }));
```

#### `addEntitiesFifo`

Add an entity or entities to the store using fifo strategy:

```ts
import { addEntitiesFifo } from '@ngneat/elf-entities';

todosStore.reduce(addEntitiesFifo([entity, entity]), { limit: 3 });
```

#### `updateEntities`

Update an entity or entities in the store:

```ts
import { updateEntities } from '@ngneat/elf-entities';

todosStore.reduce(updateEntities(id, { name }));
todosStore.reduce(updateEntities(id, (entity) => ({ ...entity, name })));
todosStore.reduce(updateEntities([id, id, id], { open: true }));
```

#### `deleteEntities`

Delete an entity or entities from the store:

```ts
import { deleteEntities } from '@ngneat/elf-entities';

todosStore.reduce(deleteEntities(id));
todosStore.reduce(deleteEntities([id, id]));
```

#### `deleteEntitiesByPredicate`

Delete an entity or entities from the store:

```ts
import { deleteEntitiesByPredicate } from '@ngneat/elf-entities';

todosStore.reduce(deleteEntitiesByPredicate((e) => !!e.completed));
```

#### `deleteAllEntities`

Delete all entities from the store:

```ts
import { deleteAllEntities } from '@ngneat/elf-entities';

todosStore.reduce(deleteAllEntities());
```

## idKey

By default, Elf takes the `id` key from the entity `id` field. To change it, you can pass the `idKey` option to
the `withEntities` function:

```ts
import { createState, Store } from '@ngneat/elf';
import { addEntities } from '@ngneat/elf-entities';

interface Todo {
  _id: number;
  label: string;
}

const { state, config } = createState(
  withEntities<Todo, '_id'>({ idKey: '_id' })
);

const todosStore = new Store({ name: 'todos', state, config });
```
