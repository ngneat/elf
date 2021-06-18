import { createState } from '@elf/store/core/state';
import {
  addEntities,
  selectAll,
  updateEntities,
  withEntities,
} from '@elf/store/entities';
import { select, Store, withProps } from '@elf/store/core';
import { Injectable } from '@angular/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { write } from '../../store/mutations';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodosProps {
  filter: 'ALL' | 'ACTIVE' | 'COMPLETED';
}

const { state, config } = createState(
  withEntities<Todo, Todo['id']>(),
  withProps<TodosProps>({ filter: 'ALL' })
);

const store = new Store({ name: 'todos', state, config });

@Injectable({ providedIn: 'root' })
export class TodosRepository {
  todos$ = store.pipe(selectAll());
  filter$ = store.pipe(select((state) => state.filter));

  visibleTodos$ = combineLatest([this.filter$, this.todos$]).pipe(
    map((data) => filterTodos(...data))
  );

  addTodo(title: Todo['title']) {
    store.reduce(addEntities({ id: Math.random(), title, completed: false }));
  }

  updateFilter(filter: TodosProps['filter']) {
    store.reduce(
      write((state) => {
        state.filter = filter;
      })
    );
  }

  updateCompleted(id: Todo['id']) {
    store.reduce(
      updateEntities(id, (entity) => ({
        ...entity,
        completed: !entity.completed,
      }))
    );
  }
}

function filterTodos(filter: TodosProps['filter'], todos: Todo[]) {
  switch (filter) {
    case 'COMPLETED':
      return todos.filter((t) => t.completed);
    case 'ACTIVE':
      return todos.filter((t) => !t.completed);
    default:
      return todos;
  }
}
