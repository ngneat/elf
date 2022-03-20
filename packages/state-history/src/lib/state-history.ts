import { isFunction, Store, StoreValue } from '@ngneat/elf';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter } from 'rxjs/operators';

export interface StateHistoryOptions<State> {
  maxAge: number;

  // comparatorFn: (prev, current) => isEqual(prev, current) === false
  comparatorFn: (prevState: State, currentState: State) => boolean;
}

type History<State> = {
  past: State[];
  present: State | null;
  future: State[];
};

class StateHistory<T extends Store, State extends StoreValue<T>> {
  private paused = false;

  private history: History<State> = {
    past: [],
    present: null,
    future: [],
  };

  private skipUpdate = false;
  private subscription: Subscription | undefined;

  private hasPastSubject = new BehaviorSubject(false);
  private hasFutureSubject = new BehaviorSubject(false);

  private mergedOptions: StateHistoryOptions<State>;

  hasPast$ = this.hasPastSubject.asObservable().pipe(distinctUntilChanged());
  hasFuture$ = this.hasFutureSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor(
    protected store: T,
    private options: Partial<StateHistoryOptions<State>> = {}
  ) {
    this.mergedOptions = { maxAge: 10, comparatorFn: () => true, ...options };
    this.activate();
  }

  get hasPast() {
    return this.history.past.length > 0;
  }

  get hasFuture() {
    return this.history.future.length > 0;
  }

  activate() {
    this.subscription = this.store
      .pipe(filter(() => !(this.skipUpdate || this.paused)))
      .subscribe((present) => {
        const past = this.history.present;

        const shouldUpdate =
          !past || this.mergedOptions.comparatorFn!(past, present);

        if (shouldUpdate) {
          if (this.history.past.length === this.mergedOptions.maxAge) {
            this.history.past = this.history.past.slice(1);
          }
          if (past) {
            this.history.past = [...this.history.past, past];
          }
          this.history.present = present;
          this.updateHasHistory();
        }
      });
  }

  undo() {
    if (this.history.past.length) {
      const { past, present, future } = this.history;
      const previous = past[past.length - 1];
      this.history.past = past.slice(0, past.length - 1);
      this.history.present = previous;
      this.history.future = [present!, ...future];
      this.update();
    }
  }

  redo() {
    if (this.history.future.length) {
      const { past, present, future } = this.history;
      const next = future[0];
      const newFuture = future.slice(1);
      this.history.past = [...past, present!];
      this.history.present = next;
      this.history.future = newFuture;
      this.update();
    }
  }

  jumpToPast(index: number) {
    if (index < 0 || index >= this.history.past.length) return;

    const { past, future, present } = this.history;
    const newPast = past.slice(0, index);
    const newFuture = [
      ...past.slice(index + 1),
      present,
      ...future,
    ] as History<State>['future'];
    const newPresent = past[index];
    this.history.past = newPast;
    this.history.present = newPresent;
    this.history.future = newFuture;
    this.update();
  }

  jumpToFuture(index: number) {
    if (index < 0 || index >= this.history.future.length) return;

    const { past, future, present } = this.history;

    const newPast = [...past, present, ...future.slice(0, index)];
    const newPresent = future[index];
    const newFuture = future.slice(index + 1);
    this.history.past = newPast as History<State>['past'];
    this.history.present = newPresent;
    this.history.future = newFuture;
    this.update();
  }

  /**
   *
   * jump n steps in the past or forward
   *
   */
  jump(n: number) {
    if (n > 0) return this.jumpToFuture(n - 1);
    if (n < 0) return this.jumpToPast(this.history.past.length + n);
  }

  /**
   *
   * Clear the history
   *
   * @param customUpdateFn Callback function for only clearing part of the history
   *
   * @example
   *
   * stateHistory.clear((history) => {
   *  return {
   *    past: history.past,
   *    present: history.present,
   *    future: []
   *  };
   * });
   */
  clear(customUpdateFn?: (history: History<State>) => History<State>) {
    this.history = isFunction(customUpdateFn)
      ? customUpdateFn(this.history)
      : {
          past: [],
          present: null,
          future: [],
        };
    this.updateHasHistory();
  }

  destroy({ clearHistory = false }: { clearHistory?: boolean } = {}) {
    if (clearHistory) {
      this.clear();
    }

    this.subscription?.unsubscribe();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  private update() {
    this.skipUpdate = true;
    this.store.update(() => this.history.present);
    this.updateHasHistory();
    this.skipUpdate = false;
  }

  private updateHasHistory() {
    this.hasFutureSubject.next(this.hasFuture);
    this.hasPastSubject.next(this.hasPast);
  }
}

export function stateHistory<T extends Store, State extends StoreValue<T>>(
  store: T,
  options: Partial<StateHistoryOptions<State>> = {}
) {
  return new StateHistory<T, State>(store, options);
}
