# Requests

To add support for monitoring requests status in your store,
you need to install the package by calling `elf-cli install` and selecting the requests package (`@ngneat/elf-requests`).
Then, in any server call used by the store, you can add a call to the `setRequestStatus` operator.

```ts
getData() {
  return http.get(...).pipe(
      setRequestStatus(this.repo.store, 'getDataAPI'));
}
```

This will ensure the store will have the getData API call listed as `pending` in the store, until the call complete,
at which point it changes to either `success` or `error`. You can monitor and change the request status for your APIs
using the following methods: `selectRequestStatus`, `updateRequestStatus`, `getRequestStatus`, and `selectIsRequestPending`.

```ts
storeStatus$ = store.pipe(selectRequestStatus('getDataAPI'));
```
