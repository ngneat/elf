import { Store, StoreDef } from './store';
import { Subject } from 'rxjs';

const registry = new Map<string, Store>();
const registryActions = new Subject<{ type: 'add' | 'remove'; store: Store }>();

export const registry$ = registryActions.asObservable();

export function addStore(store: Store) {
  registry.set(store.name, store);
  registryActions.next({ type: 'add', store });
}

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

  registry.forEach((value, key) => {
    stores[key as keyof T] = value.getValue();
  });

  return stores;
}
