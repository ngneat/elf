# Getting Started 
To create the initial state used by your store call the createState() method. This method returns a state object and a config object. They are then used in the creation of the store.

```ts
const { state, config } = createState();
```

The method can accept any number of Features which describe the nature of the store. For example:

```ts
const { state, config } = createState(
  withEntities<Todo>(),
  withUIEntities<UIEntity>(),
  withProps<{ foo: string }>({ foo: '' })
);
``` 

The features can be either one or more of the available features in Elf, or additional features you can create or add from other sources.
