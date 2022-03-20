import { createStore, withProps } from '@ngneat/elf';
import {
  selectAllEntities,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { produce } from 'immer';

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

const store = createStore(
  { name: 'todos' },
  withEntities<Todo>(),
  withProps<TodosProps>({ filter: 'ALL' })
);

export const todos$ = store.pipe(selectAllEntities());

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
