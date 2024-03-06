import { isRecord } from '@ngneat/elf';
import { Observable, of } from 'rxjs';

export type Async<T> = Promise<T> | Observable<T>;

export interface StateStorage {
  getItem<T extends Record<string, any> | string>(
    key: string,
  ): Async<T | null | undefined>;

  setItem(key: string, value: Record<string, any> | string): Async<any>;

  removeItem(key: string): Async<boolean | void>;
}

function createStorage(storage: Storage | undefined): StateStorage | undefined {
  if (!storage) {
    return undefined;
  }

  return {
    getItem(key: string) {
      const value = storage.getItem(key);

      try {
        return of(JSON.parse(value!));
      } catch (e) {
        return of(value);
      }
    },
    setItem(key: string, value: Record<string, any> | string) {
      const formattedValue = isRecord(value) ? JSON.stringify(value) : value;
      storage.setItem(key, formattedValue);
      return of(true);
    },
    removeItem(key: string) {
      storage.removeItem(key);
      return of(true);
    },
  };
}

// we need to wrap the access to window.localStorage and window.sessionStorage in a try catch
// because localStorage can be disabled, or be denied by a security rule
// as soon as we access the property, it throws an error
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
