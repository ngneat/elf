import { createStore, select, withProps } from '@ngneat/elf';
import { localStorageStrategy, persistState } from '@ngneat/elf-persist-state';

interface AuthProps {
  user: { id: string } | null;
}

const authStore = createStore(
  { name: 'auth' },
  withProps<AuthProps>({ user: null })
);

export const persist = persistState(authStore, {
  key: 'auth',
  storage: localStorageStrategy,
});

const user$ = authStore.pipe(select((state) => state.user));

user$.subscribe(console.log);

// Should be the value after a refresh
setTimeout(() => {
  authStore.update((state) => ({
    ...state,
    user: { id: '1' },
  }));
}, 1000);
