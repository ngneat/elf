import { createStore, withProps } from '@ngneat/elf';
import { stateHistory } from '@ngneat/elf-state-history';

const todosStore = createStore(
  { name: 'auth' },
  withProps<{ user: string }>({
    user: '',
  })
);

export const todosStateHistory = stateHistory(todosStore);

todosStore.subscribe(console.log);

todosStore.update((state) => ({
  ...state,
  user: 'Elf',
}));

todosStateHistory.undo();
