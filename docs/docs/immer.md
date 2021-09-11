# Using Immer

When working with immutable objects, we often get to what’s called a “spread hell” situation. If you prefer working with immutable objects in a mutable fashion, you can use immer with Elf.

Create a mutation function:

```ts title="store/mutations.ts"
import { produce } from 'immer';

export function write<S>(updater: (state: S) => void): (state: S) => S {
  return function (state: S) {
    return produce(state, (draft) => {
      updater(draft as S);
    });
  };
}
```

Now you can use it in the store's `reducer` function:

```ts title="todos.respository.ts"
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodosProps {
  filter: 'ALL' | 'ACTIVE' | 'COMPLETED';
}

const { state, config } = createState(
  withEntities<Todo>(),
  withProps<TodosProps>({ filter: 'ALL' })
);

const store = new Store({ name: 'todos', state, config });

export class TodosRepository {
  todos$ = store.pipe(selectAll());

  updateFilter(filter: TodosProps['filter']) {
    store.reduce(
      // highlight-start
      write((state) => {
        state.filter = filter;
      })
      // highlight-end
    );
  }

  updateCompleted(id: Todo['id']) {
    store.reduce(
      updateEntities(
        id,
        // highlight-next-line
        write<Todo>((entity) => (entity.completed = !entity.completed))
      )
    );
  }
}
```
