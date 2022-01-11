import { Injectable } from '@angular/core';
import { createState, select, Store, withProps } from '@ngneat/elf';
import {
  addEntities,
  selectAll,
  selectAllApply,
  selectEntityByPredicate,
  selectManyByPredicate,
  updateEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { switchMap } from 'rxjs/operators';
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

  selectByCompletedState(completed: Todo['completed']) {
    return store.pipe(
      selectManyByPredicate((entity) => entity.completed === completed)
    );
  }

  selectFirstCompletedTitle() {
    return store.pipe(
      selectEntityByPredicate((entity) => entity.completed, { pluck: 'title' })
    );
  }

  addTodo(title: Todo['title']) {
    store.update(addEntities({ id: Math.random(), title, completed: false }));
  }

  updateFilter(filter: TodosProps['filter']) {
    store.update(
      write((state) => {
        state.filter = filter;
      })
    );
  }

  updateCompleted(id: Todo['id']) {
    store.update(
      updateEntities(id, (entity) => ({
        ...entity,
        completed: !entity.completed,
      }))
    );
  }
}
