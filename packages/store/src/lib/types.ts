export type OrArray<T> = T[] | T;
export type StateOf<S extends (...args: any) => any> = ReturnType<S>['props'];
export type Query<S, R> = (state: S, context: StoreContext) => R;

export type StoreContext = { config: Record<PropertyKey, any> };
