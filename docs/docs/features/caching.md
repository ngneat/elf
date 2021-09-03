# Caching
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