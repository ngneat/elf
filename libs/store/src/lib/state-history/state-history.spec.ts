import { stateHistory } from './index';
import { createState, propsFactory, Store } from '@ngneat/elf';

function eq(store: Store, value: number) {
  expect(store.state).toEqual({ prop: value });
}

describe('state history', () => {
  const { withProp, setProp } = propsFactory('prop', { initialValue: 0 });

  it('should work', () => {
    const { state, config } = createState(withProp());
    const store = new Store({ state, config, name: '' });

    const history = stateHistory(store);

    eq(store, 0);
    store.reduce(setProp(1));
    eq(store, 1);

    history.undo();
    eq(store, 0);

    history.redo();
    eq(store, 1);

    store.reduce(setProp(2));
    store.reduce(setProp(3));
    eq(store, 3);

    history.undo();
    eq(store, 2);

    history.undo();
    eq(store, 1);

    history.pause();

    store.reduce(setProp(4));
    store.reduce(setProp(5));
    eq(store, 5);
    history.undo();
    eq(store, 0);

    history.resume();
    store.reduce(setProp(1));
    history.undo();
    eq(store, 0);
  });
});
