import { Store, StoreValue, isRecord } from '@ngneat/elf';
import { Observable, ReplaySubject, from, of } from 'rxjs';
import { skip, switchMap } from 'rxjs/operators';
import { StateStorage } from './storage';

interface Options<S extends Store> {
  storage: StateStorage;
  source?: (store: S) => Observable<Partial<StoreValue<S>>>;
  preStoreInit?: (value: StoreValue<S>) => Partial<StoreValue<S>>;
  preStoreValueInit?: (
    value: Record<string, any> | string,
  ) => Partial<StoreValue<S>>;
  preStorageUpdate?: (
    storeName: string,
    state: Partial<StoreValue<S>>,
  ) => Partial<StoreValue<S>>;
  preStorageValueUpdate?: (
    storeName: string,
    state: Partial<StoreValue<S>>,
  ) => Partial<StoreValue<S>> | string;
  key?: string;
  runGuard?(): boolean;
}

export function persistState<S extends Store>(store: S, options: Options<S>) {
  const defaultOptions: Partial<Options<S>> = {
    source: (store) => store,
    preStoreInit: (value) => value,
    preStorageUpdate: (storeName, value) => value,
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

  const { storage } = options;
  const initialized = new ReplaySubject<boolean>(1);

  const loadFromStorageSubscription = from(
    storage.getItem(merged.key!),
  ).subscribe((value) => {
    if (value) {
      const preparedValue = merged.preStoreValueInit
        ? merged.preStoreValueInit(value)
        : isRecord(value)
          ? value
          : { value };

      store.update((state) => {
        return merged.preStoreInit!({
          ...state,
          ...preparedValue,
        });
      });
    }

    initialized.next(true);
    initialized.complete();
  });

  const saveToStorageSubscription = merged.source!(store)
    .pipe(
      skip(1),
      switchMap((value) => {
        const updatedValue = merged.preStorageUpdate
          ? merged.preStorageUpdate(store.name, value)
          : value;

        const preparedValue = merged.preStorageValueUpdate
          ? merged.preStorageValueUpdate(store.name, updatedValue)
          : updatedValue;

        return storage.setItem(merged.key!, preparedValue);
      }),
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
