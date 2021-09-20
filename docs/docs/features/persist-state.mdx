# Persist State

The `persistState()` function gives you the ability to persist some of the app’s state, by saving it to `localStorage/sessionStorage` or anything that implements the `StorageEngine` API, and restore it after a refresh.

First, you need to install the package by using the CLI command or npm:

```bash
npm i @ngneat/elf-persist-state
```

To use it you should call the `persistState()` function, passing the store and the options:

```ts
import { Store, createState, withProps } from '@ngneat/elf';
import {
  persistState,
  localStorageStrategy,
  sessionStorageStrategy,
} from '@ngneat/elf-persist-state';

interface AuthProps {
  user: { id: string } | null;
}

const { state, config } = createState(withProps<AuthProps>({ user: null }));

const authStore = new Store({ state, name, config });

class AuthRepository {
  private persist = persistState(authStore, {
    key: 'auth',
    storage: localStorageStrategy,
  });

  user$ = authStore.pipe(select((state) => state.user));
}
```

As the second parameter you should pass a `Options` object, which can be used to define the following:

- `storage`: an Object with `setItem`, `getItem` and `removeItem` method for storing the state (required).
- `source`: a method that receives the store and return what to save from it (by default - the entire store).
- `preStoreInit`: a method that run upon initializing the store with a saved value, used for any required modifications before the value is set.
- `key`: the name under which the store state is saved (by default - the store name plus a `@store` suffix).

Elf also exposes the `initialized$` observable. This observable emits after Elf initialized the stores based on the storage's value. For example:

```ts
import { persistState, localStorageStrategy } from '@ngneat/elf-persist-state';

const instance = persistState(todoStore, {
  key: 'todos',
  storage: localStorageStrategy,
});

instance.initialized$.subscribe(console.log);
```
