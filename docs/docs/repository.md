# The Repository Pattern

The recommended way to use Elf is following the Repository Design Pattern. Implementing the Repository pattern is relatively simple. It's a class that encapsulates the store queries and mutations: 

```ts
import { Store, createState, withProps } from '@ngneat/elf';

interface AuthProps {
  user: { id: string } | null
}

const { state, config } = createState(
  withProps<AuthProps>({ user: null })  
)

const authStore = new Store({ state, name, config });

class AuthRepository {
  user$ = authStore.pipe(select(state => state.user));
  
  updateUser(user: AuthProps['user']) {
    authStore.reduce(state => ({
      ...state,
      user
    }))
  }
}

```

The Repository pattern provides 2 main benefits:
1. Using the pattern, you can replace your data store without changing your business code.
2. It encourages you to implement all store operations in one place, making your code more reusable and easy to find.


### Creating a Repository with the CLI
Elf comes with a CLI that'll generate a repository with all the features you need. Run the following command:

```bash
npx @ngneat/elf-cli repo
```

Answer the questions, and see the magic happens.
