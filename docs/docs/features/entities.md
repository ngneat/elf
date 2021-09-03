# Entities
This feature enables the store to act as an entity store - this means it handles objects as entities (similarly to a database table), each with an id field (which is by default “id”).  So for instance, if you use:

```ts
const { state, config } = createState(
  withEntities<Todo>()
);
``` 

This will allow you to use the following ready-made reducers in your Store:
`addEntities`, `addEntitiesFifo`, `deleteEntities`, `deleteEntitiesByPredicate`, `deleteAllEntities`, `setEntities`, `updateEntities`, `updateEntitiesByPredicate`, `updateAllEntities`.
Simply import the ones you need from the library. Similarly, you can query the store with the `getEntity` or `selectEntity`
query methods (the former returns the value based on the id/predicate, the latter - an Observable). 
