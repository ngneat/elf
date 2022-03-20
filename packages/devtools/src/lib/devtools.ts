import {
  capitalize,
  getRegistry,
  getStore,
  getStoresSnapshot,
  registry$,
  Store,
} from '@ngneat/elf';
import { Observable, Subject, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';

type Action = { type: string } & Record<string, any>;
type ActionsDispatcher = Observable<Action>;

interface DevtoolsOptions {
  maxAge?: number;
  name?: string;
  postTimelineUpdate?: () => void;
  preAction?: () => void;
  actionsDispatcher?: ActionsDispatcher;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: {
      connect(options: DevtoolsOptions): {
        send(
          data: { type: string } & Record<string, any>,
          state: Record<string, any>
        ): void;
        init(state: Record<string, any>): void;
        unsubscribe(): void;
        subscribe(
          cb: (message: {
            type: string;
            payload: { type: string };
            state: string;
          }) => void
        ): () => void;
      };
    };
  }
}

const externalEvents$ = new Subject<Action>();

export function send(action: Action) {
  externalEvents$.next(action);
}

export function devTools(options: DevtoolsOptions = {}) {
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;

  let lock = false;
  const instance = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
  const subscriptions = new Map<string, Subscription>();

  const send = (action: Action) => {
    instance.send(action, getStoresSnapshot());
  };

  subscriptions.set('externalSend', externalEvents$.subscribe(send));

  const addStore = (store: Store<any, any>) => {
    const name = store.name;
    const displayName = capitalize(name);

    send({ type: `[${displayName}] - @Init` });

    const update = store.pipe(skip(1)).subscribe(() => {
      if (lock) {
        lock = false;
        return;
      }

      options.preAction?.();
      send({ type: `[${displayName}] - Update` });
    });

    subscriptions.set(name, update);
  };

  // There should be support for stores that were created before we initialized the `devTools`
  getRegistry().forEach(addStore);

  if (options.actionsDispatcher) {
    subscriptions.set(
      'actionsDispatcher',
      options.actionsDispatcher.subscribe((action) => {
        send(action);
      })
    );
  }

  const subscription = registry$.subscribe(({ store, type }) => {
    const name = store.name;
    const displayName = capitalize(name);

    if (type === 'add') {
      addStore(store);
    }

    if (type === 'remove') {
      subscriptions.get(name)?.unsubscribe();
      subscriptions.delete(name);
      send({ type: `Remove ${displayName}` });
    }
  });

  const devtoolsDispose = instance.subscribe((message) => {
    if (message.type === 'DISPATCH') {
      const payloadType = message.payload.type;

      if (payloadType === 'COMMIT') {
        instance.init(getStoresSnapshot());
        return;
      }

      if (payloadType === 'JUMP_TO_STATE' || payloadType === 'JUMP_TO_ACTION') {
        const state = JSON.parse(message.state);

        for (const [name, value] of Object.entries(state)) {
          lock = true;
          getStore(name)?.update(() => value);
        }

        options.postTimelineUpdate?.();
      }
    }
  });

  return {
    unsubscribe() {
      subscription.unsubscribe();
      instance.unsubscribe();
      subscriptions.forEach((sub) => sub.unsubscribe());
      devtoolsDispose();
    },
  };
}
