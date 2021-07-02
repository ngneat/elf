import {
  Store,
  createState,
  withProps,
  withEntities,
  addEntities,
  updateEntities,
  removeEntities,
  withUIEntities,
  withActiveId,
  selectActiveEntity,
  setActiveId,
  withActiveIds,
  selectActiveEntities,
  toggleActiveIds,
  withCache,
  selectCache,
  setCache,
  CacheState,
  withStatus,
  selectStatus,
  setStatus,
  StatusState,
} from '@ngneat/elf';

export interface AlertUI {
  _id: number;
}

export interface Alert {
  _id: number;
}

export interface AlertsProps {}

const { state, config } = createState(
  withProps<AlertsProps>({}),
  withEntities<Alert, '_id'>({ idKey: '_id' }),
  withUIEntities<AlertUI, '_id'>({ idKey: '_id' }),
  withActiveId(),
  withActiveIds(),
  withCache(),
  withStatus()
);
const store = new Store({ name: 'alerts', state, config });

export class AlertsRepository {
  status$ = store.pipe(selectStatus());
  cache$ = store.pipe(selectCache());
  activeAlerts$ = store.pipe(selectActiveEntities());
  activeAlert$ = store.pipe(selectActiveEntity());
  alerts$ = store.pipe(selectAll());

  addAlert(alert: Alert) {
    store.reduce(addEntities(alert));
  }

  updateAlert(id: Alert['_id'], alert: Partial<Alert>) {
    store.reduce(updateEntities(id, alert));
  }

  deleteAlert(id: Alert['_id']) {
    store.reduce(removeEntities(id));
  }

  setActiveId(id: Alert['_id']) {
    store.reduce(setActiveId(id));
  }

  toggleActiveIds(ids: Array<Alert['_id']>) {
    store.reduce(toggleActiveIds(ids));
  }

  updateCache(value: CacheState) {
    store.reduce(setCache(value));
  }

  updateStatus(value: StatusState) {
    store.reduce(setStatus(value));
  }
}
