import { BehaviorSubject, Observable } from 'rxjs';
import { addStore, removeStore } from './registry';

export class Store<
  SDef extends StoreDef = any,
  State = SDef['state']
> extends BehaviorSubject<State> {
  private currentValue: State;

  constructor(public storeDef: SDef) {
    super(storeDef.state);
    this.currentValue = storeDef.state;
    addStore(this);
  }

  get state() {
    return this.currentValue;
  }

  get name() {
    return this.storeDef.name;
  }

  getConfig<Config extends Record<any, any>>(): Config {
    return this.storeDef.config;
  }

  query<R>(selector: (state: State) => R) {
    return selector(this.currentValue);
  }

  reduce(...reducers: Array<Reducer<State>>) {
    const nextState = reducers.reduce((value, reducer) => {
      value = reducer(value, this);

      return value;
    }, this.currentValue);

    if (nextState !== this.currentValue) {
      this.currentValue = nextState;
      super.next(this.currentValue);
    }
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

  getValue(): State {
    throw new Error(`Use the state getter`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next(_: State) {
    throw new Error(`Using next() isn't allowed`);
  }

  error() {
    throw new Error(`Using error() isn't allowed`);
  }

  complete() {
    throw new Error(`Using complete() isn't allowed`);
  }
}

export type StoreValue<T extends Store> = T['state'];
export type Reducer<State> = (state: State, store: Store) => State;

export interface StoreDef<State = any> {
  name: string;
  state: State;
  config: any;
}
