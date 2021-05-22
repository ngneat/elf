import { BehaviorSubject, Observable } from 'rxjs';
import { produce } from 'immer';

export type Reducer<State> = (state: State, store: Store) => State;

export interface StoreDef<State = any> {
  name: string;
  state: State;
  config: any;
}

export class Store<SDef extends StoreDef = any, State = SDef['state']> extends BehaviorSubject<State> {
  private currentValue: State;

  constructor(public storeDef: SDef) {
    super(storeDef.state);
    this.currentValue = this.getValue();
  }

  get state() {
    return this.currentValue;
  }

  get name() {
    return this.storeDef.name;
  }

  getConfig<Config>(): Config {
    return this.storeDef.config;
  }

  reduce(...reducers: Array<Reducer<State>>) {
    const nextState = reducers.reduce((value, reducer) => {
      value = reducer(value, this);

      return value;
    }, this.currentValue);

    if(nextState !== this.currentValue) {
      super.next(nextState);
    }

  }

  combine<R extends Observables>(observables: R): Observable<ReturnTypes<R>> {
    let hasChange = true;
    const buffer: any = [];

    return new Observable(observer => {
      observables.forEach((query, i) => observer.add(
        query.subscribe(value => {
          buffer[i] = value;
          hasChange = true;
        })));

      return this.subscribe({
        next() {
          if(hasChange) {
            observer.next(buffer);
            hasChange = false;
          }
        },
        error(e) {
          observer.error(e);
        },
        complete() {
          observer.complete();
        }
      });
    });

  }
}

type ReturnTypes<T extends Observable<any>[]> = { [P in keyof T]: T[P] extends Observable<infer R> ? R : never };
type Observables = [Observable<any>] | Observable<any>[];
