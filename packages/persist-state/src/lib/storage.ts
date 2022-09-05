import { Observable, of } from 'rxjs';

export type Async<T> = Promise<T> | Observable<T>;

export interface StateStorage {
  getItem<T extends Record<string, any>>(
    key: string
  ): Async<T | null | undefined>;

  setItem(key: string, value: Record<string, any>): Async<any>;

  removeItem(key: string): Async<boolean | void>;
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

const tryGetLocalStorage = () => {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage;
    }
  } catch {
    // eslint-disable-next-line no-empty
  }
  return undefined;
};
export const localStorageStrategy = createStorage(tryGetLocalStorage())!;

const tryGetSessionStorage = () => {
  try {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage;
    }
  } catch {
    // eslint-disable-next-line no-empty
  }
  return undefined;
};
export const sessionStorageStrategy = createStorage(tryGetSessionStorage())!;
