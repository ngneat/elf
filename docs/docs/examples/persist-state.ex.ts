import { Store, createState, withProps, select } from '@ngneat/elf';
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state';

interface AuthProps {
  user: { id: string } | null;
}

const { state, config } = createState(withProps<AuthProps>({ user: null }));

const authStore = new Store({ state, name: 'auth', config });

export const persist = persistState(authStore, {
  key: 'auth',
  storage: localStorageStrategy,
});

const user$ = authStore.pipe(select((state) => state.user));

user$.subscribe(console.log);

// Should be the value after a refresh
setTimeout(() => {
  authStore.reduce((state) => ({
    ...state,
    user: { id: '1' },
  }));
}, 1000);
