# Persist State

To add support for persisting the state of your store in between user visit,
you need to install the package by calling `elf-cli install` and selecting the requests package (`@ngneat/elf-persist-state`).
Then, call the `persistState` method when you want to saving your state.

```ts
persistState(this.store);
```

As the second parameter you can pass a `Options` object, which can be used to define the following:
`storage`: an Object with `setItem`, `getItem` and `removeItem` method for storing the state (required).
`source`: a method that receives the store and return what to save from it (by default - the entire store).
`preStoreInit`: a method that run upon initializing the store with a saved value, used for any required modifications before the value is set.
`key`: the name under which the store state is saved (by default - the store name plus a `@store` suffix).
