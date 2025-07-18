import { NotVoid } from './types';

interface ElfHooksRegistry {
  preStoreUpdate?: (
    currentState: any,
    nextState: any,
    storeName: string,
  ) => NotVoid<any>;

  preStateInit?: (initialState: any, storeName: string) => NotVoid<any>;
}

// this is internal object that's not exported to public API
export const elfHooksRegistry: ElfHooksRegistry = {};

class ElfHooks {
  registerPreStoreUpdate<T>(
    fn: (currentState: any, nextState: any, storeName: string) => NotVoid<T>,
  ) {
    elfHooksRegistry.preStoreUpdate = fn;
  }

  registerPreStateInit<T>(
    fn: (initialState: any, storeName: string) => NotVoid<T>,
  ) {
    elfHooksRegistry.preStateInit = fn;
  }
}

export const elfHooks = new ElfHooks();
