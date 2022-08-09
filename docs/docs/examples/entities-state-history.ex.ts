import { createStore } from '@ngneat/elf';
import {
  selectAllEntities,
  withEntities,
  withUIEntities,
  UIEntitiesRef,
  updateEntities,
} from '@ngneat/elf-entities';
import { entitiesStateHistory } from '@ngneat/elf-state-history';

interface Todo {
  id: number;
  label: string;
}

interface TodoUI {
  id: number;
  selected: boolean;
}

const todosStore = createStore(
  { name: 'auth' },
  withEntities<Todo>({
    initialValue: [
      { id: 0, label: 'Todo 1' },
      { id: 1, label: 'Todo 2' },
    ],
  }),
  withUIEntities<TodoUI>({
    initialValue: [
      { id: 0, selected: false },
      { id: 1, selected: false },
    ],
  })
);

export const todosStateHistory = entitiesStateHistory(todosStore);
export const todosUIStateHistory = entitiesStateHistory(todosStore, {
  entitiesRef: UIEntitiesRef,
});

todosStore
  .pipe(selectAllEntities())
  .subscribe((entities) => console.log('Entities: ', entities));
todosStore
  .pipe(selectAllEntities({ ref: UIEntitiesRef }))
  .subscribe((entities) => console.log('UI Entities: ', entities));

todosStore.update(
  updateEntities([0, 1], { label: 'Renamed Todo' }),
  updateEntities([0, 1], { selected: true }, { ref: UIEntitiesRef })
);

todosStateHistory.undo(0);
todosUIStateHistory.undo(0);
