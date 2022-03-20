export type OrArray<T> = T[] | T;
export type StateOf<S extends (...args: any) => any> = ReturnType<S>['props'];
export type Query<S, R> = (state: S) => R;
export type NotVoid<R> = R extends void ? never : R;
