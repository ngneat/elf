import { from, Observable, ReplaySubject } from 'rxjs';
import { Store, StoreValue } from '@eleanor/store/core';
import { skip, switchMap } from 'rxjs/operators';
import { StateStorage } from '@eleanor/store/presist-state/storage';

interface Options<S extends Store> {
  storage: StateStorage;
  source?: (store: S) => Observable<Partial<StoreValue<S>>>;
  preStoreInit?: (value: StoreValue<S>) => Partial<StoreValue<S>>;
}

export function persistState<S extends Store>(store: S, options: Options<S>) {
  const defaultOptions: Partial<Options<S>> = {
    source: store => store,
    preStoreInit: value => value
  };

  const merged = { ...defaultOptions, ...options };

  const { setItem, getItem } = options.storage;
  const initialized = new ReplaySubject(1);
  const name = `${store.name}@store`;

  from(getItem(name)).subscribe((value) => {
    if(value) {
      store.reduce((state) => {
        return merged.preStoreInit!({
          ...state,
          ...value
        });
      });
    }

    initialized.next();
    initialized.complete();
  });

  const subscription = merged.source!(store).pipe(
    skip(1),
    switchMap((value: StoreValue<S>) => setItem(name, value))).subscribe();

  return {
    initialized$: initialized.asObservable(),
    unsubscribe() {
      subscription.unsubscribe();
    }
  };
}
