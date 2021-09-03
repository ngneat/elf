import { Observable, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { registry$ } from '@ngneat/elf';
import { getStoresSnapshot } from 'packages/store/src/lib/core/registry';

type Action = { type: string } & Record<string, any>;
type ActionsDispatcher = Observable<Action>;

interface DevtoolsOptions {
  maxAge?: number;
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
          cb: (message: { type: string; payload: { type: string } }) => void
        ): () => void;
      };
    };
  }
}

export function devTools(options: DevtoolsOptions = {}) {
  const capitalize = (value: string) =>
    value && value.charAt(0).toUpperCase() + value.slice(1);
  const instance = window.__REDUX_DEVTOOLS_EXTENSION__.connect(options);
  const subscriptions = new Map<string, Subscription>();

  const send = (action: Action) => {
    instance.send(action, getStoresSnapshot());
  };

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

      const update = store.pipe(skip(1)).subscribe(() => {
        options.preAction?.();
        send({ type: `[${displayName}] - Update` });
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
