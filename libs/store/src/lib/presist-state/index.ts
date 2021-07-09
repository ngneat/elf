import { from, Observable, ReplaySubject } from 'rxjs';
import { StateStorage } from './storage';
import { skip, switchMap } from 'rxjs/operators';
import { Store, StoreValue } from '../core';

interface Options<S extends Store> {
  storage: StateStorage;
  source?: (store: S) => Observable<Partial<StoreValue<S>>>;
  preStoreInit?: (value: StoreValue<S>) => Partial<StoreValue<S>>;
  key?: string;
}

export function persistState<S extends Store>(store: S, options: Options<S>) {
  const defaultOptions: Partial<Options<S>> = {
    source: (store) => store,
    preStoreInit: (value) => value,
    key: options.key ?? `${store.name}@store`
  };

  const merged = { ...defaultOptions, ...options };

  const { setItem, getItem } = options.storage;
  const initialized = new ReplaySubject(1);

  from(getItem(merged.key!)).subscribe((value) => {
    if (value) {
      store.reduce((state) => {
        return merged.preStoreInit!({
          ...state,
          ...value,
        });
      });
    }

    initialized.next();
    initialized.complete();
  });

  const subscription = merged.source!(store)
    .pipe(
      skip(1),
      switchMap((value: StoreValue<S>) => setItem(merged.key!, value))
    )
    .subscribe();

  return {
    initialized$: initialized.asObservable(),
    unsubscribe() {
      subscription.unsubscribe();
    },
  };
}
