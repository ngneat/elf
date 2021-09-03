# Pagination

This feature requires the `withEntities` to be used in the Store. To add support for pagination in your entities store, 
you need to install the package by calling `elf-cli install` and selecting the pagination package (`@ngneat/elf-pagination`). 
To add the feature to your store declare it in the `createState` call:

```ts
const { state, config } = createState(
withEntities<Item>(),
withPagination()
);
```

Call `updatePaginationData()` with a configuration object that determines the various pagination settings, and call `setPage()` whenever you want to define the ids that belong to a certain page number.

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

Additional methods available are: 
`setCurrentPage` (by default it's page 1), `selectCurrentPage`,
`selectCurrentPageEntities`, `selectHasPage`, `hasPage`, `deletePage`, `deleteAllPages`, `updatePaginationData`,
`selectPaginationData`, `getPaginationData`, and `skipWhilePageExists`, which enables you to skip server calls
if the page exists in the store.
