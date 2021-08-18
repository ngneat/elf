# A Reactive State Management for JS Application (WIP)

## Introduction - What is Elf

Elf is a state management solution created by Netanel Basal, who originated the Akita state management library.  
Elf uses the [Repository design pattern](https://medium.com/@pererikbergman/repository-design-pattern-e28c0f3e4a30).
It organically emerged as part of the development of [Akita](#akita). 

## Why use Elf?

Due to the nature of the repository pattern, there are several substantial benefits to using Elf for managing the state in your apps:
* When replacing Elf methods, they only need to be replaced in a single location.
* The methods are completely tree shakeable, meaning if a method is not utilized it will not be part of your bundle.
* The methods are easily hackable, and provide you with the ability to override the default handling of the state operations.


## The Elf CLI

Elf comes with a CLI that enables a fast and easy setup of your store. To install it, simply run:

```
$ npm install -g @ngneat/elf-cli
```

Once installed, the CLI offers a variety of commands which enable you to set up your initial state and store. For more on the CLI check out its [documentation](https://github.com/ngneat/elf/blob/55a204bae1aee8616278e6c0550fc7782752dfe3/tools/cli/README.md).

## createState()
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

### Features

#### withStatus
This feature ensures that the store will include a status value. The value is either 'idle', 'pending' (the initial value), 'success', or 'error'. This will allow you to use the following methods, imported from the library:

withStatus - checks whether a status
selectStatus - returns an Observable that holds the store’s status and enables subscribing to it.
setStatus - set’s the store status

#### withEntities
This feature enables the store to act as an entity store - this means it handles objects as entities (similarly to a database table), each with an id field (which is by default “id”).  So for instance, if you use:

```ts
const { state, config } = createState(
  withEntities<Todo>()
);
``` 

This will allow you to import and use the following generated methods: `setEntities`, `addEntities`, `updateEntities` & `deleteEntities`.
Additional methods include: `addEntitiesFifo`. 

#### UIEntities 
This feature allows the store to hold UI-specific entity data, for instance whether the card representing an entity has been opened by the user.  
When used in conjunction with `withEntities` this can be used to store additional UI data separately from the entities themselves.

```ts
type UIEntity = { id: number; open: boolean };

const { state, config } = createState(
  withUIEntities<UIEntity>(),
);
``` 
The usage is similar to that of entities - you can use the same methods, with the addition of a `ref: entitiesUIRef` in the method's options parameter, e.g.: 
```ts
addEntities (uiItems, {ref: entitiesUIRef});
```

#### withProps
This feature allows you to hold additional store properties separate from its main storage, such a which filters the user is currently using. 

```ts
const { state, config } = createState(
  withProps<Props>({ filter: 'ALL' })
);
``` 

#### cache 

#### ActiveId 

#### Create your own filter.

## Creating the Store

Once you've received a state and config from the createState method call, creating an Elf store is as simple as using them and calling:

```ts
const store = new Store({ state, name: 'storeName', config });
````

## Writing in the Store
To write to the store, add a `store.reduce()` call, and place inside it any reducer functions you want to use to change the store state. 
```ts
    store.reduce(
      addEntities(items),
      addEntities (uiItems, {ref: entitiesUIRef})
    );
```


## Querying the Store
To read from the store, add a `store.reduce()` call, and place inside it any reducer functions you want to use to change the store state.

You can also get the entire store state by simply calling `this.store.state`.

## Plugins:

### PersistState 
### StateHistory

## DevTools

## <a id="akita"></a> What about Akita?

Akita is still actively maintained, and thriving (2.4 million downloads to date!). 
It is a complete solution - Elf is merely another option. 
Furthermore, Akita is Datorama driven, and therefore performing significant changes was difficult. 
Elf was created to be more community driven.


