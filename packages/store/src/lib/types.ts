export type SomeArray<T> = T[] | ReadonlyArray<T>;
export type OrArray<T> = SomeArray<T> | T;
export type StateOf<S extends (...args: any) => any> = ReturnType<S>['props'];
export type Query<S, R> = (state: S) => R;
