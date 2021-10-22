import { BehaviorSubject, Observable } from 'rxjs';
import { Query } from '..';
import { addStore, removeStore } from './registry';
import { StoreContext } from './types';

export const STORE_CONTEXT = Symbol('STORE_CONTEXT');

export function getStoreContext(state: any): StoreContext {
  return state[STORE_CONTEXT];
}

export class Store<
  SDef extends StoreDef = any,
  State = SDef['state']
> extends BehaviorSubject<State> {
  initialState!: State;

  private context: StoreContext = {
    config: this.getConfig(),
  };

  constructor(private storeDef: SDef) {
    super(
      Object.assign(storeDef.state, {
        [STORE_CONTEXT]: {
          config: storeDef.config,
        },
      })
    );
    this.initialState = this.getValue();
    addStore(this);
  }

  get name() {
    return this.storeDef.name;
  }

  getConfig<Config extends Record<any, any>>(): Config {
    return this.storeDef.config;
  }

  query<R>(selector: Query<State, R>) {
    return selector(this.getValue(), this.context);
  }

  update(...reducers: Array<Reducer<State>>) {
    const currentState = this.getValue();

    const nextState = reducers.reduce((value, reducer) => {
      value = reducer(value, this.context);

      return value;
    }, currentState);

    if (nextState !== currentState) {
      if (!(nextState as any)[STORE_CONTEXT]) {
        (nextState as any)[STORE_CONTEXT] = this.context;
      }

      super.next(nextState);
    }
  }

  reset() {
    this.update(() => this.initialState);
  }

  combine<O extends Record<string, Observable<any>>>(
    observables: O
  ): Observable<{
    [P in keyof O]: O[P] extends Observable<infer R> ? R : never;
  }> {
    let hasChange = true;
    const buffer: Record<string, any> = {};

    return new Observable((observer) => {
      for (const [key, query] of Object.entries(observables)) {
        observer.add(
          query.subscribe((value) => {
            buffer[key] = value;
            hasChange = true;
          })
        );
      }

      return this.subscribe({
        next() {
          if (hasChange) {
            observer.next(buffer as any);
            hasChange = false;
          }
        },
        error(e) {
          observer.error(e);
        },
        complete() {
          observer.complete();
        },
      });
    });
  }

  destroy() {
    removeStore(this);
  }

  next(value: State) {
    this.update(() => value);
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  error() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  complete() {}
}

export type StoreValue<T extends Store> = ReturnType<T['getValue']>;
export type Reducer<State> = (state: State, context: StoreContext) => State;

export interface StoreDef<State = any> {
  name: string;
  state: State;
  config: any;
}
