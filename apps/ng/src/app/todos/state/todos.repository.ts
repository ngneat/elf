import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { write } from '../../store/mutations';
import { createState, select, Store, withProps } from '@ngneat/elf';
import {
  addEntities,
  selectAll,
  selectAllApply,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';

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

@Injectable({ providedIn: 'root' })
export class TodosRepository {
  todos$ = store.pipe(selectAll());
  filter$ = store.pipe(select((state) => state.filter));

  visibleTodos$ = this.filter$.pipe(
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
