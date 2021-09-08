# UI Entities

This feature allows the store to hold UI-specific entity data, for instance, whether the user has opened the card representing an entity.
When used in conjunction with `withEntities` this can be used to store additional UI data separately from the entities themselves.

```ts
import { createState, Store } from '@ngneat/elf';
import { withEntities, withUIEntities } from '@ngneat/elf-entities';

interface TodoUI { id: number; open: boolean };
interface Todo { id: number; name: string; }

const { state, config } = createState(
  withEntities<Todo>(),  
  withUIEntities<TodoUI>()  
);

const todosStore = new Store({ name: 'todos', state, config });
```

The usage is similar to that of `entities` - you can use the same selectors and mutations, with the addition of passing the
`UIEntitiesRef` ref in the method's `options` parameter, e.g.:

```ts
import { addEntities, UIEntitiesRef, selectEntity } from '@ngneat/elf-entities';

todosStore.reduce(
  addEntities({ id: 1, name: 'foo' }),
  addEntities({ id: 1, open: true }, { ref: UIEntitiesRef })  
)

uiEntity$ = todosStore.pipe(selectEntity(1, { ref: UIEntitiesRef } ))
```

We can use the `intersectEntities()` operator that returns a combined collection of the entities and their corresponding `UIEntities`:

```ts
import { intersectEntities, selectAll, selectEntities } from '@ngneat/elf-entities';

todos$ = todosStore
  .combine({
    entities: store.pipe(selectAll()),
    UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
  })
  .pipe(intersectEntities());
```
