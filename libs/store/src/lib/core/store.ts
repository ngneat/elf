import { BehaviorSubject } from 'rxjs';

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
    this.currentValue = reducers.reduce((value, reducer) => {
      value = reducer(value, this);

      return value;
    }, this.currentValue);

    super.next(this.currentValue);
  }

  destroy() {
    // stores.removeStore(this.name);
  }
}
