import {
  Store,
  OrArray,
  coerceArray,
  isUndefined,
  filterNil,
  StoreValue,
} from '@ngneat/elf';
import { Subscription, pairwise, filter, map } from 'rxjs';
import {
  EntitiesState,
  getIdType,
  EntitiesRef,
  getEntityType,
  DefaultEntitiesRef,
  upsertEntities,
  getEntitiesIds,
  selectEntity,
  selectEntities,
} from '@ngneat/elf-entities';

export interface EntitiesStateHistoryOptions<
  T extends Store<any, StoreValue<any> & EntitiesState<E>>,
  E extends EntitiesRef,
  S extends StoreValue<T> = StoreValue<T>
> {
  maxAge: number;
  entitiesRef?: E;
  entityIds?: OrArray<getIdType<EntitiesState<E>, E>>;
  // comparatorFn: (prev, current) => isEqual(prev, current) === false
  comparatorFn: (
    prevState: getEntityType<S, E>,
    currentState: getEntityType<S, E>
  ) => boolean;
}

type EntityHistory<E extends EntitiesRef> = {
  past: Array<getEntityType<EntitiesState<E>, E>>;
  present: getEntityType<EntitiesState<E>, E> | null;
  future: Array<getEntityType<EntitiesState<E>, E>>;
};

export class EntitiesStateHistory<
  T extends Store<any, StoreValue<any> & EntitiesState<E>>,
  E extends EntitiesRef,
  S extends StoreValue<T> = StoreValue<T>
> {
  private entitiesHistory = new Map<
    getIdType<EntitiesState<E>, E>,
    EntityHistory<E>
  >();
  private entitiesChanges = new Map<
    getIdType<EntitiesState<E>, E>,
    Subscription
  >();
  private pausedEntitiesChanges = new Set<getIdType<EntitiesState<E>, E>>();

  private skipUpdate = false;
  private subscription: Subscription | undefined;

  private mergedOptions: EntitiesStateHistoryOptions<T, E, S>;

  constructor(
    protected store: T,
    private options: Partial<EntitiesStateHistoryOptions<T, E, S>> = {}
  ) {
    this.mergedOptions = {
      maxAge: 10,
      comparatorFn: () => true,
      ...options,
    };
    this.activate();
  }

  activate() {
    /**
     * If we want to check specific entities.
     */
    if (this.mergedOptions.entityIds) {
      coerceArray(this.mergedOptions.entityIds).forEach((id) => {
        this.subscribeToEntityChanges(id);
      });
    } else {
      this.subscription = this.store
        .pipe(
          selectEntities(this.entitiesRef),
          map(() => this.store.query(getEntitiesIds(this.entitiesRef))),
          pairwise()
        )
        .subscribe(([prevEntities, currentEntities]) => {
          const currentIdsMap = new Set<getIdType<S, E>>(currentEntities);
          const allChangedIdsMap = new Set<getIdType<S, E>>([
            ...prevEntities,
            ...currentEntities,
          ]);

          allChangedIdsMap.forEach((entityId) => {
            if (!currentIdsMap.has(entityId)) {
              this.unsubscribeFromEntityChanges(entityId);
            } else if (!this.entitiesChanges.has(entityId)) {
              this.subscribeToEntityChanges(entityId);
            }
          });
        });
    }
  }

  hasPast(id: getIdType<S, E>): boolean {
    const historyById = this.entitiesHistory.get(id);

    return historyById ? historyById.past.length > 0 : false;
  }

  hasFuture(id: getIdType<S, E>): boolean {
    const historyById = this.entitiesHistory.get(id);

    return historyById ? historyById.future.length > 0 : false;
  }

  undo(ids?: OrArray<getIdType<S, E>>) {
    const entities: Array<getEntityType<S, E>> = [];

    this.getEntitiesIds(ids).forEach((id) => {
      const history = this.entitiesHistory.get(id);

      if (history?.past.length) {
        const { past, present, future } = history;
        const newPresent = past[past.length - 1];

        this.entitiesHistory.set(id, {
          past: past.slice(0, past.length - 1),
          present: newPresent,
          future: [present, ...future],
        });

        entities.push(newPresent);
      }
    });

    this.update(entities);
  }

  redo(ids?: OrArray<getIdType<S, E>>) {
    const entities: Array<getEntityType<S, E>> = [];

    this.getEntitiesIds(ids).forEach((id) => {
      const history = this.entitiesHistory.get(id);

      if (history?.future.length) {
        const { past, present, future } = history;
        const newPresent = future[0];
        const newFuture = future.slice(1);

        this.entitiesHistory.set(id, {
          past: [...past, present],
          present: newPresent,
          future: newFuture,
        });

        entities.push(newPresent);
      }
    });

    this.update(entities);
  }

  jumpToPast(index: number, ids?: OrArray<getIdType<S, E>>) {
    const entities: Array<getEntityType<S, E>> = [];

    this.getEntitiesIds(ids).forEach((id) => {
      const history = this.entitiesHistory.get(id);

      if (history?.past.length) {
        if (index < 0 || index >= history.past.length) return;

        const { past, present, future } = history;
        const newPast = past.slice(0, index);
        const newFuture = [...past.slice(index + 1), present, ...future];
        const newPresent = past[index];

        this.entitiesHistory.set(id, {
          past: newPast,
          present: newPresent,
          future: newFuture,
        });

        entities.push(newPresent);
      }
    });

    this.update(entities);
  }

  jumpToFuture(index: number, ids?: OrArray<getIdType<S, E>>) {
    const entities: Array<getEntityType<S, E>> = [];

    this.getEntitiesIds(ids).forEach((id) => {
      const history = this.entitiesHistory.get(id);

      if (history?.future.length) {
        if (index < 0 || index >= history.future.length) return;

        const { past, present, future } = history;
        const newPast = [...past, present, ...future.slice(0, index)];
        const newPresent = future[index];
        const newFuture = future.slice(index + 1);

        this.entitiesHistory.set(id, {
          past: newPast,
          present: newPresent,
          future: newFuture,
        });

        entities.push(newPresent);
      }
    });

    this.update(entities);
  }

  /**
   *
   * Clear the past history.
   * It's different from clear method since it doesn't remove present state
   *
   * @param ids Entities ids which past history will be erased
   *
   * @example
   *
   * stateHistory.clearPast([1, 2]);
   */
  clearPast(ids?: OrArray<getIdType<S, E>>) {
    this.getEntitiesIds(ids).forEach((id) => {
      const entityHistory = this.entitiesHistory.get(id);

      if (entityHistory) {
        this.entitiesHistory.set(id, {
          ...entityHistory,
          past: [],
        });
      }
    });
  }

  /**
   *
   * Clear the future history
   * It's different from clear method since it doesn't remove present state
   *
   * @param ids Entities ids which future history will be erased
   *
   * @example
   *
   * stateHistory.clearFuture([1, 2]);
   */
  clearFuture(ids?: OrArray<getIdType<S, E>>) {
    this.getEntitiesIds(ids).forEach((id) => {
      const entityHistory = this.entitiesHistory.get(id);

      if (entityHistory) {
        this.entitiesHistory.set(id, {
          ...entityHistory,
          future: [],
        });
      }
    });
  }

  /**
   *
   * Clear the history
   *
   * @param ids Entities ids which history will be erased
   *
   * @param customUpdateFn Update function to update history manually
   *
   * @example
   *
   * stateHistory.clear([1, 2]);
   */
  clear(
    ids?: OrArray<getIdType<S, E>>,
    customUpdateFn?: (history: EntityHistory<E>) => EntityHistory<E>
  ) {
    this.getEntitiesIds(ids).forEach((id) => {
      const entityHistory = this.entitiesHistory.get(id);

      if (entityHistory) {
        const newHistory = customUpdateFn && customUpdateFn(entityHistory);

        if (newHistory) {
          this.entitiesHistory.set(id, newHistory);
        } else {
          this.entitiesHistory.delete(id);
        }
      }
    });
  }

  destroy({ clearHistory = false }: { clearHistory?: boolean } = {}) {
    if (clearHistory) {
      this.clear();
    }

    this.subscription?.unsubscribe();
    this.entitiesChanges.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.entitiesChanges.clear();
  }

  pause(ids?: OrArray<getIdType<S, E>>) {
    this.getEntitiesIds(ids).forEach((id) => {
      this.pausedEntitiesChanges.add(id);
    });
  }

  resume(ids?: OrArray<getIdType<S, E>>) {
    this.getEntitiesIds(ids).forEach((id) => {
      this.pausedEntitiesChanges.delete(id);
    });
  }

  private get entitiesRef() {
    return this.mergedOptions.entitiesRef
      ? { ref: this.mergedOptions.entitiesRef }
      : {};
  }

  private update(entities: Array<getEntityType<S, E>>) {
    if (!entities.length) {
      return;
    }

    this.skipUpdate = true;
    this.store.update(upsertEntities(entities, this.entitiesRef));
    this.skipUpdate = false;
  }

  private subscribeToEntityChanges(id: getEntityType<S, E>) {
    const subscription = this.store
      .pipe(
        selectEntity(id, this.entitiesRef),
        filterNil(),
        filter(() => !(this.skipUpdate || this.pausedEntitiesChanges.has(id)))
      )
      .subscribe((entity) => {
        const entityHistory =
          this.entitiesHistory.get(id) || this.getDefaultHistory();
        const prevEntity = entityHistory.present;
        const shouldUpdate =
          !prevEntity || this.mergedOptions.comparatorFn(prevEntity, entity);

        if (shouldUpdate) {
          if (entityHistory.past.length === this.mergedOptions.maxAge) {
            entityHistory.past = entityHistory.past.slice(1);
          }

          this.entitiesHistory.set(id, {
            ...entityHistory,
            present: entity,
            past: prevEntity
              ? [...entityHistory.past, prevEntity]
              : [...entityHistory.past],
          });
        }
      });

    this.entitiesChanges.set(id, subscription);
  }

  private unsubscribeFromEntityChanges(id: getEntityType<S, E>) {
    this.entitiesChanges.get(id)?.unsubscribe();
    this.entitiesChanges.delete(id);
    this.entitiesHistory.delete(id);
  }

  private getEntitiesIds(
    ids?: OrArray<getIdType<S, E>>
  ): Array<getIdType<S, E>> {
    if (isUndefined(ids)) {
      if (this.mergedOptions.entityIds) {
        return coerceArray(this.mergedOptions.entityIds);
      }

      return this.store.query(getEntitiesIds());
    }

    return coerceArray(ids);
  }

  private getDefaultHistory(): EntityHistory<E> {
    return {
      past: [],
      present: null,
      future: [],
    };
  }
}

type WithEntitiesState<
  S extends StoreValue<Store>,
  E extends EntitiesRef
> = S extends EntitiesState<E> & infer R
  ? EntitiesState<E> & R
  : S extends EntitiesState<E>
  ? EntitiesState<E>
  : never;

export function entitiesStateHistory<
  T extends Store<any, WithEntitiesState<StoreValue<T>, E>>,
  E extends EntitiesRef = DefaultEntitiesRef
>(store: T, options: Partial<EntitiesStateHistoryOptions<T, E>> = {}) {
  return new EntitiesStateHistory<T, E>(store, options);
}
