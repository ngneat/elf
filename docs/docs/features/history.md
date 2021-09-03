#State History
To add support for monitoring the history of the state in your store,
you need to install the package by calling `elf-cli install` and selecting the requests package (`@ngneat/elf-state-history`).
Then, call the `stateHistory` method when you want to start monitoring.

```ts
const storeHistory = stateHistory(this.store);
```

As the second parameter you can pass a `StateHistoryOptions` object, which can be used to define the store's maximum age and state comparator function.
Whenever the store receives a new state (of, if a comparator function was passed in the options,
whenever the old state and the new state are determined to be different by it), the new state is set as the history's present and the old one saved in the 'past'.
This allows you to use the following methods to jump to points in the store's history timeline: `undo`, `redo`, `jumpToPast`, `jumpToFuture`.
You can also call the `pause` and `resume` methods to toggle the monitoring of the state changes.
