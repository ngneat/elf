import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { registry$ } from '@ngneat/elf';

interface DevtoolsOptions {
  maxAge?: number;
  preAction?: () => void;
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

  const rootState: Record<string, any> = {};
  const subscriptions = new Map<string, Subscription>();

  const send = (
    data: { type: string } & Record<string, any>,
    state?: Record<string, any>
  ) => {
    instance.send(data, state ?? rootState);
  };

  const subscription = registry$.subscribe(({ store, type }) => {
    const name = store.name;
    const displayName = capitalize(name);

    if (type === 'add') {
      rootState[name] = store.state;
      send({ type: `[${displayName}] - @Init` }, rootState);

      const update = store.pipe(skip(1)).subscribe((value) => {
        rootState[name] = value;
        options.preAction?.();
        send({ type: `[${displayName}] - Update` }, rootState);
      });

      subscriptions.set(name, update);
    }

    if (type === 'remove') {
      Reflect.deleteProperty(rootState, name);
      subscriptions.get(name)!.unsubscribe();
      subscriptions.delete(name);
      send({ type: `Remove ${displayName}` }, rootState);
    }
  });

  const devtoolsDispose = instance.subscribe((message) => {
    if (message.type === 'DISPATCH') {
      const payloadType = message.payload.type;

      if (payloadType === 'COMMIT') {
        instance.init(rootState);
        return;
      }
    }
  });

  return {
    send,
    unsubscribe() {
      subscription.unsubscribe();
      instance.unsubscribe();
      subscriptions.forEach((sub) => sub.unsubscribe());
      devtoolsDispose();
    },
  };
}
