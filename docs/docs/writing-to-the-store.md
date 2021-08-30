# Writing to the Store
To write to the store, add a `store.reduce()` call, and place inside it any reducer functions you want to use to change the store state.

```ts
    store.reduce(
      addEntities(items),
      addEntities (uiItems, {ref: UIEntitiesRef})
    );
```

You can also create your own reducer - a method that receives the existing state and store and returns a state which will serve as the store's new state.

<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
