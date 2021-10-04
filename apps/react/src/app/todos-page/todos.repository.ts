import { Store, createState, withProps, select } from '@ngneat/elf';
import {
  withEntities,
  setEntities,
  addEntities,
  updateEntities,
  deleteEntities,
  selectAllApply,
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

const { state, config } = createState(
  withProps<TodosProps>({ filter: 'ALL' }),
  withEntities<Todo>()
);
const store = new Store({ name: 'todos', state, config });

const filter$ = store.pipe(select(({ filter }) => filter));

export const visibleTodos$ = filter$.pipe(
  switchMap((filter) => {
    return store.pipe(
      selectAllApply({
        filterEntity({ completed }) {
          if (filter === 'ALL') return true;
          return filter === 'COMPLETED' ? completed : !completed;
        },
      })
    );
  })
);

export function updateTodosFilter(filter: TodosProps['filter']) {
  store.reduce((state) => ({
    ...state,
    filter,
  }));
}

export function setTodos(todos: Todo[]) {
  store.reduce(setEntities(todos));
}

export function addTodo(text: Todo['text']) {
  store.reduce(
    addEntities({
      id: Math.random().toFixed(5),
      text,
      completed: false,
    })
  );
}

export function updateTodoCompleted(id: Todo['id']) {
  store.reduce(
    updateEntities(id, (todo) => ({
      ...todo,
      completed: !todo.completed,
    }))
  );
}

export function deleteTodo(id: Todo['id']) {
  store.reduce(deleteEntities(id));
}
