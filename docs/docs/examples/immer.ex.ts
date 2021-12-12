import { produce } from 'immer';
import { withProps, Store, createState } from '@ngneat/elf';
import { withEntities, selectAll, updateEntities } from '@ngneat/elf-entities';

export function write<S>(updater: (state: S) => void): (state: S) => S {
  return function (state) {
    return produce(state, (draft) => {
      updater(draft as S);
    });
  };
}

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

export const todos$ = store.pipe(selectAll());

export function updateFilter(filter: TodosProps['filter']) {
  store.update(
    write((state) => {
      state.filter = filter;
    })
  );
}

export function updateCompleted(id: Todo['id']) {
  store.update(
    updateEntities(
      id,
      write<Todo>((entity) => (entity.completed = !entity.completed))
    )
  );
}
