export type OrArray<T> = T[] | T;

export type CacheState = 'none' | 'partial' | 'full';
export type StatusState = 'idle' | 'pending' | 'success' | 'error';
export type StateOf<S extends (...args: any) => any> = ReturnType<S>['state']
