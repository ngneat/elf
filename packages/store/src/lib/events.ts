import { Subject } from 'rxjs';

export interface StoreEvent {
  type: 'add' | 'delete' | 'update' | 'set';
  ids: any[];
}

let events: StoreEvent[] = [];

/**
 *
 * @private function don't use
 *
 */
export function _setEvent(e: StoreEvent) {
  events.push(e);
}

export function emitEvents(source: Subject<StoreEvent>) {
  if (events.length) {
    events.forEach((e) => source.next(e));
  }

  events = [];
}
