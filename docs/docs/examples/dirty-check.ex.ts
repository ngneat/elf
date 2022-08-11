import { createStore, withProps } from '@ngneat/elf';
import { dirtyCheck } from '@ngneat/elf-dirty-check';

const todosStore = createStore(
  { name: 'auth' },
  withProps<{ user: string }>({
    user: '',
  })
);

export const dirty = dirtyCheck(todosStore);

todosStore.subscribe(console.log);

dirty.setHead();
todosStore.update((state) => ({
  ...state,
  user: 'Elf',
}));

dirty.isDirty();
// or
dirty.isDirty$.subscribe(console.log);
