import { from, Observable, of, ReplaySubject } from 'rxjs';
import { StateStorage } from './storage';
import { skip, switchMap } from 'rxjs/operators';
import { Store, StoreValue } from '@ngneat/elf';

interface Options<S extends Store> {
  storage: StateStorage;
  source?: (store: S) => Observable<Partial<StoreValue<S>>>;
  preStoreInit?: (value: StoreValue<S>) => Partial<StoreValue<S>>;
  key?: string;
  runGuard?(): boolean;
}

export function persistState<S extends Store>(store: S, options: Options<S>) {
  const defaultOptions: Partial<Options<S>> = {
    source: (store) => store,
    preStoreInit: (value) => value,
    key: options.key ?? `${store.name}@store`,
    runGuard() {
      return typeof window !== 'undefined';
    },
  };

  const merged = { ...defaultOptions, ...options };

  if (!merged.runGuard?.()) {
    return {
      initialized$: of(false),
      unsubscribe() {
        //
      },
    };
  }

  const { setItem, getItem } = options.storage;
  const initialized = new ReplaySubject<boolean>(1);

  const loadFromStorageSubscription = from(getItem(merged.key!)).subscribe(
    (value) => {
      if (value) {
        store.update((state) => {
          return merged.preStoreInit!({
            ...state,
            ...value,
          });
        });
      }

      initialized.next(true);
      initialized.complete();
    }
  );

  const saveToStorageSubscription = merged.source!(store)
    .pipe(
      skip(1),
      switchMap((value) => setItem(merged.key!, value))
    )
    .subscribe();

  return {
    initialized$: initialized.asObservable(),
    unsubscribe() {
      saveToStorageSubscription.unsubscribe();
      loadFromStorageSubscription.unsubscribe();
    },
  };
}
