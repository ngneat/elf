import {
  createStore,
  EntityActions,
  ofType,
  select,
  withProps,
} from '@ngneat/elf';
import {
  addEntities,
  deleteAllEntities,
  deleteEntities,
  selectAllEntitiesApply,
  setEntities,
  updateAllEntities,
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

export const addOrRemoveEntities$ = store.actions$.pipe(
  ofType([EntityActions.Add, EntityActions.Remove])
);
export const removedEntities$ = store.actions$.pipe(
  ofType(EntityActions.Remove)
);
export const updatedEntities$ = store.actions$.pipe(
  ofType(EntityActions.Update)
);
export const settedEntities$ = store.actions$.pipe(ofType(EntityActions.Set));
export const addedEntities$ = store.actions$.pipe(ofType(EntityActions.Add));
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
