<p align="center">
 <img width="20%" height="20%" src="elf.png">
</p>

# A Reactive State Management for JS Application (WIP)

```ts
const { state, config } = createState(
  withEntities<Todo>(),
  withUIEntities<UIEntity>(),
  withProps<{ foo: string }>({ foo: '' })
);

const store = new Store({ state, name: 'todos', config });

class TodosRepositry {
  todos$ = store.pipe(selectAll());
  todo$ = (id) => store.pipe(selectEntity(id));

  addTodo() {
    store.reduce(
      addEntity({ id: 1, title: '' }),
      write((state) => {
        state.foo = 'newfoo';
      })
    );
  }
}
```
