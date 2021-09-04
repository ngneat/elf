# UI Entities

This feature allows the store to hold UI-specific entity data, for instance whether the card representing an entity has been opened by the user.  
When used in conjunction with `withEntities` this can be used to store additional UI data separately from the entities themselves.

```ts
type UIEntity = { id: number; open: boolean };

const { state, config } = createState(withUIEntities<UIEntity>());
```

The usage is similar to that of entities - you can use the same methods, with the addition of a `ref: UIEntitiesRef`
in the method's options parameter, e.g.:

```ts
addEntities(uiItems, { ref: UIEntitiesRef });
```

It's common to have a store with Entities and corresponding UIEntities, in which case they can be easily combined using the `intersectEntities()` method.

```ts
storeItems$ = this.store
  .combine({
    entities: store.pipe(selectAll()),
    UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
  })
  .pipe(intersectEntities());
```
