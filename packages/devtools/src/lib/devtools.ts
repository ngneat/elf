import { Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import {
  capitalize,
  registry$,
  getStoresSnapshot,
  getRegistry,
  Store,
} from '@ngneat/elf';

type Action = { type: string } & Record<string, any>;
type ActionsDispatcher = Observable<Action>;

interface DevtoolsOptions {
  maxAge?: number;
  name?: string;
  preAction?: () => void;
  actionsDispatcher?: ActionsDispatcher;
  getActionType?: (state: any) => string;
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
          cb: (message: { type: string; payload: { type: string } }) => void
        ): () => void;
      };
    };
  }
}

export function devTools(options: DevtoolsOptions = {}) {
  if (!window.__REDUX_DEVTOOLS_EXTENSION__) return;

  const instance = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
  const subscriptions = new Map<string, Subscription>();

  const send = (action: Action) => {
    instance.send(action, getStoresSnapshot());
  };

  const addStore = (store: Store<any, any>) => {
    const name = store.name;
    const displayName = capitalize(name);

    send({ type: `[${displayName}] - @Init` });

    const update = store.pipe(skip(1)).subscribe((state) => {
      options.preAction?.();
      const actionType = options.getActionType?.(state) || 'Update';
      send({ type: `[${displayName}] - ${actionType}` });
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
      send({ type: `[${displayName}] - @Init` });

      const update = store.pipe(skip(1)).subscribe((state) => {
        options.preAction?.();
        const actionType = options.getActionType?.(state) || 'Update';
        send({ type: `[${displayName}] - ${actionType}` });
      });

      subscriptions.set(name, update);
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
