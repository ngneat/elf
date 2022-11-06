import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Action, Query } from '..';
import { batchDone$, batchInProgress } from './batch';
import { elfHooksRegistry } from './elf-hooks';
import { addStore, removeStore } from './registry';

type IdKeyType<SDef extends StoreDef<any>> =
  Store<SDef>['state']['ids'] extends Array<infer ID> ? ID : never;

export class Store<
  SDef extends StoreDef<any> = any,
  State = SDef['state']
> extends BehaviorSubject<State> {
  initialState!: State;
  state!: State;
  private batchInProgress = false;

  private context: ReducerContext<IdKeyType<SDef>> = {
    config: this.getConfig(),
    // TODO Infer the Action type
    actions: new Subject<Action<IdKeyType<SDef>>>(),
  };

  // TODO Infer the Action type
  actions$: Observable<Action<IdKeyType<SDef>>> =
    this.context.actions.asObservable();

  constructor(private storeDef: SDef) {
    super(storeDef.state);
    this.state = storeDef.state;
    this.initialState = this.getValue();
    addStore(this);
  }

  get name(): StoreDef['name'] {
    return this.storeDef.name;
  }

  getConfig<Config extends Record<any, any>>(): Config {
    return this.storeDef.config;
  }

  query<R>(selector: Query<State, R>) {
    return selector(this.getValue());
  }

  update(...reducers: Array<Reducer<State>>) {
    const currentState = this.getValue();

    let nextState = reducers.reduce((value, reducer) => {
      value = reducer(value, this.context);

      return value;
    }, currentState);

    if (elfHooksRegistry.preStoreUpdate) {
      nextState = elfHooksRegistry.preStoreUpdate(
        currentState,
        nextState,
        this.name
      );
    }

    if (nextState !== currentState) {
      this.state = nextState;

      if (batchInProgress.getValue()) {
        if (!this.batchInProgress) {
          this.batchInProgress = true;

          batchDone$.subscribe(() => {
            super.next(this.state);
            this.batchInProgress = false;
          });
        }
      } else {
        super.next(this.state);
      }
    }
  }

  getValue(): State {
    return this.state;
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

export type Action$<IdKey> = Subject<Action<IdKey>>;
export type StoreValue<T extends Store<any>> = ReturnType<T['getValue']>;
export type Reducer<State> = (
  state: State,
  context: ReducerContext<any>
) => State;
export type ReducerContext<IdKey> = {
  config: Record<PropertyKey, any>;
  actions: Action$<IdKey>;
};

export interface StoreDef<State = any> {
  name: string;
  state: State;
  config: any;
}
