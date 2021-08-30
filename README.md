<p align="center">
 <img width="20%" height="20%" src="elf.png">
</p>

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

This will allow you to use the following ready-made reducers in your Store:
`addEntities`, `addEntitiesFifo`, `deleteEntities`, `deleteEntitiesByPredicate`, `deleteAllEntities`, `setEntities`, `updateEntities`, `updateEntitiesByPredicate`, `updateAllEntities`.
Simply import the ones you need from the library. Similarly, you can query the store with the `getEntity` or `selectEntity` 
query methods (the former returns the value based on the id/predicate, the latter - an Observable). 


#### withUIEntities 
This feature allows the store to hold UI-specific entity data, for instance whether the card representing an entity has been opened by the user.  
When used in conjunction with `withEntities` this can be used to store additional UI data separately from the entities themselves.

```ts
type UIEntity = { id: number; open: boolean };

const { state, config } = createState(
  withUIEntities<UIEntity>(),
);
``` 
The usage is similar to that of entities - you can use the same methods, with the addition of a `ref: UIEntitiesRef` 
in the method's options parameter, e.g.: 
```ts
addEntities (uiItems, {ref: UIEntitiesRef});
```

It's common to have a store with Entities and corresponding UIEntities, in which case they can be easily combined using the `intersectEntities()` method. 
```ts
storeItems$ = this.store.combine({
  entities: store.pipe(selectAll()),
  UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
})
  .pipe(intersectEntities());
```

#### withProps
This feature allows you to hold additional store properties separate from its main storage, such as which filters the 
user is currently using. 

```ts
const { state, config } = createState(
  withProps<Props>({ filter: 'ALL' })
);
``` 

#### withRequestsCache 

This feature lets you automatically cache the requests made for the store. It offers the following helper methods: 
`selectRequestCache`, `getRequestCache`, `selectIsRequestCached`, `isRequestCached` (similar to `selectIsRequestCached` 
except it returns the current value, rather than an `Observable`), and `skipWhileCached`, which enables skipping the 
server call if the passed id is located in the store cache. 

```ts
return this.http.get(...)
  .pipe(
    ...
    skipWhileCached(store, id)
  );
``` 

#### withActiveId 

This feature lets you hold one or more IDs indicating the entities that are currently active. It is often useful 
for monitoring which entities the user is interacting with. The following methods are available: 

`setActiveIds`, `getActiveIds`, `selectActiveIds`, `resetActiveIds`, `toggleActiveIds`, `removeActiveIds`, `addActiveIds` and `selectActiveEntities`.

#### Pagination

To add support for pagination in your entities store, you need to install the bundle by calling `elf-cli install`. Then to add the feature to your store use it like this:

```ts
const { state, config } = createState(
withEntities<Item>(),
withPagination()
);
```

Call `updatePaginationData()` with an object that determines the various pagination settings, and call `setPage()` whenever you want to define the ids that belong to a certain page number.

```ts
    store.reduce(
  addEntities(data),
  updatePaginationData({currentPage: 1, perPage: 10, total: 96, lastPage: 10}),
  setPage(
    1,
    data.map((c) => c.id)
  )
);
```

Additional methods available are: `setCurrentPage` (by default it's page 1), `selectCurrentPage`, `selectHasPage`,`hasPage`, `deletePage`,`deleteAllPages`,`updatePaginationData`,`selectPaginationData`,`getPaginationData`,

#### Create Your Own Feature

You can create your own feature by extending the `FeatureBuilder` abstract class. 

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
      addEntities (uiItems, {ref: UIEntitiesRef})
    );
```

You can also create your own reducer - a method that receives the existing state and store and returns a state which will serve as the store's new state. 

## Querying the Store
There are several methods of querying the store: 

1. To Store extend an RxJS `BehaviorSubject`, so reading from it is as simple as subscribing to it. 

2. You can call the `store.query()` method and pass a method to return the 

3. Alternatively, you can call one or more queries inside a `pipe()`. 
```ts
store.pipe(selectEntity(id));
```

When calling more than one also can use the `store.combine()` and pass it the `Observables` array.  

4. You can also get the entire store state by simply calling `this.store.state`.

### Pagination
This is a feature which arrives in a separate bundle. To install it run the command 'elf-cli install'


## Plugins:

### PersistState 
### StateHistory

## DevTools
Elf provides built-in integration with the Redux dev-tools Chrome extension.

## Usage
Install the Redux extension from the supported App stores ( [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/) ).

And call the `devtools()` method:

```ts
import { devTools } from '@ngneat/elf';

devTools();
```

## Options
The plugin supports the following options passed as the second function parameter:

`maxAge`: Maximum amount of actions to be stored in the history tree.

`preAction`: A method that's called before each action.

## <a id="akita"></a> What about Akita?

Akita is still actively maintained, and thriving (2.4 million downloads to date!). 
It is a complete solution - Elf is merely another option. 
Furthermore, Akita is Datorama driven, and therefore performing significant changes was difficult. 
Elf was created to be more community driven.



<div>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
