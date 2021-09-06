# The Store

The store takes an object that contains three properties - a `state`, a `name`, and `config`.

```ts
import { Store, createState, withProps } from '@ngneat/elf';

interface AuthProps {
  user: { id: string } | null
}

const { state, config } = createState(
  withProps<AuthProps>({ user: null })  
)

const authStore = new Store({ state, name, config });
```

// explain createState
A state is composition of properties. 

### Querying the Store
A store is a `BehaviorSubject`. Therefore, we can subscribe to it to get its initial value and its subsequent values: 

```ts
authStore.subscribe(state => {
  console.log(state);  
})
```

#### Using the `select` Operator
Select a slice from the store:

```ts
const user$ = authStore.pipe(select(state => state.user));
```

The `select()` operator returns an observable that calls `distinctUntilChanged()` internally, meaning it will only fire when the state changes, i.e., when there is a new reference to the selected state.

We can also query its value once without the need to subscribe:

```ts
const state = authStore.state;
```

### Updating the Store
To update the store, we can use the `reduce` method which  receives a callback function, which gets the current `state`, and returns a new immutable `state`, which will be the new value of the store:

```ts
authStore.reduce(state => ({
  ...state,
  user: { id: 'foo' }
}))
```
