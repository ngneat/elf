# Creating the Store

Once you've received a state and config from the createState method call, creating an Elf store is as simple as using them and calling:

```ts
const store = new Store({ state, name: 'storeName', config });
````
