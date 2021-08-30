# Querying the Store
There are several methods of querying the store:

1. To Store extend an RxJS `BehaviorSubject`, so reading from it is as simple as subscribing to it.

2. You can call the `store.query()` method and pass a method to return the

3. Alternatively, you can call one or more queries inside a `pipe()`.
```ts
store.pipe(selectEntity(id));
```

When calling more than one also can use the `store.combine()` and pass it the `Observables` array.

4. You can also get the entire store state by simply calling `this.store.state`.
