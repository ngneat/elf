# Caching

To add support for monitoring requests cache status in your store,
you need to install the package by calling `elf-cli install` and selecting the requests package (`@ngneat/elf-requests`).
To add the feature to your store declare it in the `createState` call:

```ts
const { state, config } = createState(withRequestsCache());
```

This feature lets you determine the cache status for requests made for the store (status can be 'none', 'partial' or 'full'). 
It offers the following helper methods:
`updateRequestCache`, `selectRequestCache`, `getRequestCache`, `selectIsRequestCached`, `isRequestCached` (similar to `selectIsRequestCached`
except it returns the current value, rather than an `Observable`), and `skipWhileCached`, which enables skipping the
server call if the passed id is located in the store cache.

```ts
return this.http.get(...)
  .pipe(
    ...
    skipWhileCached(store, id)
  );
```

'updateRequestCache' can also get a ttl value in milliseconds as its second parameter, which will determine how long the cached value should exist. 

```ts
    store.reduce(
      updateRequestCache(requestKey, 'full', 60000)
    );
```
