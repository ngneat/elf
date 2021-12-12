import { Store, createState, withProps } from '@ngneat/elf';
import { stateHistory } from '@ngneat/elf-state-history';

const { state, config } = createState(
  withProps<{ user: string }>({
    user: '',
  })
);

const todosStore = new Store({ state, name: 'auth', config });

export const todosStateHistory = stateHistory(todosStore);

todosStore.subscribe(console.log);

todosStore.update((state) => ({
  ...state,
  user: 'Elf',
}));

todosStateHistory.undo();
