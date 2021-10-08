import { Store, createState, withProps, select } from '@ngneat/elf';

interface AuthProps {
  user: { id: string } | null;
}

const { state, config } = createState(withProps<AuthProps>({ user: null }));

const authStore = new Store({ state, name: 'auth', config });

authStore.subscribe((state) => {
  console.log(state);
});

const user$ = authStore.pipe(select((state) => state.user));

authStore.update((state) => ({
  ...state,
  user: { id: 'foo' },
}));
