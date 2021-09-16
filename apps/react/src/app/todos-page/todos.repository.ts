import { Store, createState, withProps, select } from '@ngneat/elf';
import {
  withEntities,
  selectAll,
  setEntities,
  addEntities,
  updateEntities,
  deleteEntities,
  selectAllApply,
} from '@ngneat/elf-entities';
import { combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface TodosProps {
  filter: 'SHOW_ALL' | 'SHOW_ACTIVE' | 'SHOW_COMPLETED';
}

const { state, config } = createState(
  withProps<TodosProps>({ filter: 'SHOW_ALL' }),
  withEntities<Todo>()
);
const store = new Store({ name: 'todos', state, config });

const filter$ = store.pipe(select(({ filter }) => filter));

export const visibleTodos$ = filter$.pipe(
  switchMap((filter) => {
    return store.pipe(
      selectAllApply({
        filterEntity({ completed }) {
          if (filter === 'SHOW_ALL') return true;
          return filter === 'SHOW_COMPLETED' ? completed : !completed;
        },
      })
    );
  })
);

// const todos$ = store.pipe(selectAll());

// export const visibleTodos$ = combineLatest([todos$, filter$]).pipe(
//   map(([todos, filter]) => {
//     switch (filter) {
//       case 'SHOW_COMPLETED':
//         return todos.filter(t => t.completed);
//       case 'SHOW_ACTIVE':
//         return todos.filter(t => !t.completed);
//       default:
//         return todos;
//     }
//   })
// )

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
