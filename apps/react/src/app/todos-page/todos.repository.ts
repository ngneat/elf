import { createStore, select, withProps } from '@ngneat/elf';
import {
  addEntities,
  deleteAllEntities,
  deleteEntities,
  EntityActions,
  selectAllEntitiesApply,
  setEntities,
  updateAllEntities,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { ofTypes } from 'packages/store/src/lib/operators';
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

export const addOrRemoveEntities$ = store.actions$.pipe(
  ofTypes([EntityActions.Add, EntityActions.Remove])
);
export const removedEntities$ = store.actions$.pipe(
  ofTypes(EntityActions.Remove)
);
export const updatedEntities$ = store.actions$.pipe(
  ofTypes(EntityActions.Update)
);
export const settedEntities$ = store.actions$.pipe(ofTypes(EntityActions.Set));
export const addedEntities$ = store.actions$.pipe(ofTypes(EntityActions.Add));
export const actions$ = store.actions$;

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

export function completeAllTodos() {
  store.update(updateAllEntities({ completed: true }));
}

export function deleteTodo(id: Todo['id']) {
  store.update(deleteEntities(id));
}

export function removeAll(): void {
  store.update(deleteAllEntities());
}
