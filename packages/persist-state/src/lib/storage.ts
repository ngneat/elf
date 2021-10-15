import { Observable, of } from 'rxjs';

type MaybeAsync<T> = Promise<T> | Observable<T>;

export interface StateStorage {
  getItem<T extends Record<string, any>>(
    key: string
  ): MaybeAsync<T | undefined>;

  setItem(key: string, value: Record<string, any>): MaybeAsync<boolean>;

  removeItem(key: string): MaybeAsync<boolean>;
}

function createStorage(storage: Storage | undefined): StateStorage | undefined {
  if (!storage) {
    return;
  }

  return {
    getItem(key: string) {
      const v = storage.getItem(key);
      return of(v ? JSON.parse(v) : v);
    },
    setItem(key: string, value: Record<string, any>) {
      storage.setItem(key, JSON.stringify(value));
      return of(true);
    },
    removeItem(key: string) {
      storage.removeItem(key);
      return of(true);
    },
  };
}

export const localStorageStrategy = createStorage(
  typeof localStorage !== 'undefined' ? localStorage : undefined
)!;
export const sessionStorageStrategy = createStorage(
  typeof sessionStorage !== 'undefined' ? sessionStorage : undefined
)!;
