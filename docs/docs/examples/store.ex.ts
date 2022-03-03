import { createStore, select, withProps } from '@ngneat/elf';

interface AuthProps {
  user: { id: string } | null;
}

const authStore = createStore(
  { name: 'auth' },
  withProps<AuthProps>({ user: null })
);

authStore.subscribe((state) => {
  console.log(state);
});

const user$ = authStore.pipe(select((state) => state.user));

authStore.update((state) => ({
  ...state,
  user: { id: 'foo' },
}));
