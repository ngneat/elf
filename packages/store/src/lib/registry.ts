import { Store, StoreDef } from './store';
import { Subject } from 'rxjs';

const registry = new Map<string, Store>();
const registryActions = new Subject<{ type: 'add' | 'remove'; store: Store }>();

export const registry$ = registryActions.asObservable();

// @internal
export function addStore(store: Store) {
  registry.set(store.name, store);
  registryActions.next({ type: 'add', store });
}

// @internal
export function removeStore(store: Store) {
  registry.delete(store.name);
  registryActions.next({ type: 'remove', store });
}

export function getStore<T extends StoreDef>(
  name: string
): Store<T> | undefined {
  return registry.get(name);
}

export function getRegistry() {
  return registry;
}

export function getStoresSnapshot<T extends Record<string, any>>(): T {
  const stores: T = {} as T;

  registry.forEach((store, key) => {
    stores[key as keyof T] = store.getValue();
  });

  return stores;
}
