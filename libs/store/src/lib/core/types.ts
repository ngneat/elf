export type OrArray<T> = T[] | T;

export type StateOf<S extends (...args: any) => any> = ReturnType<S>['state'];
