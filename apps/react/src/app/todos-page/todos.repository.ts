import { createStore, select, withProps } from '@ngneat/elf';
import {
  addEntities,
  deleteEntities,
  selectAllEntitiesApply,
  setEntities,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { switchMap } from 'rxjs/operators';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodosProps {
  filter: 'ALL' | 'ACTIVE' | 'COMPLETED';
}

const store = createStore(
  { name: 'todos' },
  withProps<TodosProps>({ filter: 'ALL' }),
  withEntities<Todo>()
);

const filter$ = store.pipe(select(({ filter }) => filter));

export const visibleTodos$ = filter$.pipe(
  switchMap((filter) => {
    return store.pipe(
      selectAllEntitiesApply({
        filterEntity({ completed }) {
          if (filter === 'ALL') return true;
          return filter === 'COMPLETED' ? completed : !completed;
        },
      })
    );
  })
);

export function updateTodosFilter(filter: TodosProps['filter']) {
  store.update((state) => ({
    ...state,
    filter,
  }));
}

export function setTodos(todos: Todo[]) {
  store.update(setEntities(todos));
}

export function addTodo(text: Todo['text']) {
  store.update(
    addEntities({
      id: Math.random().toFixed(5),
      text,
      completed: false,
    })
  );
}

export function updateTodoCompleted(id: Todo['id']) {
  store.update(
    updateEntities(id, (todo) => ({
      ...todo,
      completed: !todo.completed,
    }))
  );
}

export function deleteTodo(id: Todo['id']) {
  store.update(deleteEntities(id));
}
