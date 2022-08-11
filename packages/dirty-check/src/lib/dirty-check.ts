import { Store, StoreValue } from '@ngneat/elf';
import { BehaviorSubject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

export interface DirtyCheckOptions<State> {
  /**
   * An array of keys that should be watched checked if dirty
   */
  watch?: (keyof State)[];

  /**
   * Are the previous and current state the same?
   * @param prevState previous head state
   * @param currentState current head state
   */
  comparatorFn?: (
    prevState: Partial<State> | null,
    currentState: Partial<State>
  ) => boolean;
}

type DirtyCheckProps<State> = {
  head: Partial<State> | null;
};

export class DirtyCheck<T extends Store, State extends StoreValue<T>> {
  protected options: DirtyCheckOptions<State>;
  protected subscription: Subscription | undefined;
  protected isDirtySubject = new BehaviorSubject(false);
  protected paused = false;
  protected dirtyState: DirtyCheckProps<State> = {
    head: null,
  };

  public isDirty$ = this.isDirtySubject.asObservable().pipe(
    filter(() => !this.paused),
    distinctUntilChanged()
  );

  constructor(
    protected store: T,
    options: Partial<DirtyCheckOptions<State>> = {}
  ) {
    this.options = {
      ...options,
    };
    if (!this.options.comparatorFn) {
      this.options = {
        ...this.options,
        comparatorFn: (prevState, currentState) =>
          JSON.stringify(prevState ?? '{}') ===
          JSON.stringify(currentState ?? '{}'),
      };
    }
    this.activate();
  }

  activate() {
    this.subscription = this.store
      .pipe(
        filter(() => !this.paused),
        map((state) => this.getWatchState(state))
      )
      .subscribe((present) => {
        const head = this.dirtyState.head;
        // set initial head state if null
        if (head === null) {
          this.dirtyState.head = present;
          return;
        }

        // compare against the state that was in the store when we called setHead()
        const stateIsSame = this.options.comparatorFn!(head, present);
        if (!stateIsSame) {
          this.isDirtySubject.next(true);
        }
      });
  }

  isDirty() {
    return this.isDirtySubject.value;
  }

  setHead(): void {
    this.dirtyState.head = this.getWatchState(this.store.getValue());
    this.isDirtySubject.next(false);
  }

  getHead(): DirtyCheckProps<State>['head'] {
    return this.dirtyState.head;
  }

  reset() {
    this.dirtyState = {
      head: null,
    };
    this.isDirtySubject.next(false);
  }

  destroy({ resetState = false }: { resetState?: boolean } = {}) {
    if (resetState) {
      this.reset();
    }
    this.subscription?.unsubscribe();
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  private getWatchState(state: State): Partial<State> {
    return this.options.watch
      ? this.options.watch.reduce(
          (watchState, prop) => ({ ...watchState, [prop]: state[prop] }),
          {}
        )
      : state;
  }
}

export function dirtyCheck<T extends Store, State extends StoreValue<T>>(
  store: T,
  options: Partial<DirtyCheckOptions<State>> = {}
) {
  return new DirtyCheck<T, State>(store, options);
}
