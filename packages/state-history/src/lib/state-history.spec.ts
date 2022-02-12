import { stateHistory } from './state-history';
import { createState, propsFactory, Store, withProps } from '@ngneat/elf';

function eq(store: Store, value: number) {
  expect(store.getValue()).toEqual({ prop: value });
}

describe('state history', () => {
  const { withProp, setProp } = propsFactory('prop', { initialValue: 0 });

  it('should set the current state', () => {
    const { state, config } = createState(withProps({ counter: 0 }));
    const store = new Store({ state, config, name: '' });
    const history = stateHistory(store);

    expect((history as any).history).toEqual({
      past: [],
      present: { counter: 0 },
      future: [],
    });
  });

  it('should work', () => {
    const { state, config } = createState(withProp());
    const store = new Store({ state, config, name: '' });

    const history = stateHistory(store);

    eq(store, 0);

    store.update(setProp(1)); // history [0, 1]

    eq(store, 1);

    history.undo(); // history [0]
    eq(store, 0);

    history.redo(); // history [0, 1]
    eq(store, 1);

    store.update(setProp(2)); // history [0, 1, 2]
    store.update(setProp(3)); // history [0, 1, 2, 3]
    eq(store, 3);

    history.undo(); // history [0, 1, 2]
    eq(store, 2);

    history.undo(); // history [0, 1]
    eq(store, 1);

    history.pause();

    store.update(setProp(4));
    store.update(setProp(5));
    eq(store, 5);
    history.undo(); // history [0]
    eq(store, 0);

    history.resume();

    store.update(setProp(1)); // history [0, 1]
    eq(store, 1);

    history.undo(); // history [0]

    history.undo(); // history [0]

    eq(store, 0);
  });

  it('should pause and resume correctly with partial update', () => {
    const { state, config } = createState(withProps({ first: 0, second: 0 }));
    const store = new Store({ state, config, name: '' });
    const history = stateHistory(store);

    const setFirst = (first: number) =>
      store.update((state) => ({
        ...state,
        first,
      }));

    const setSecond = (second: number) =>
      store.update((state) => ({
        ...state,
        second,
      }));

    const steps = [
      { first: 0, second: 0 },
      { first: 1, second: 0 },
      { first: 2, second: 3 },
      { first: 3, second: 3 },
    ];

    expect(store.getValue()).toEqual(steps[0]);

    setFirst(1);

    expect(store.getValue()).toEqual(steps[1]);

    history.pause();
    setSecond(1);
    setSecond(2);
    setSecond(3);
    history.resume();

    setFirst(2);

    expect(store.getValue()).toEqual(steps[2]);

    setFirst(3);

    expect(store.getValue()).toEqual(steps[3]);

    history.undo();

    expect(store.getValue()).toEqual(steps[2]);

    history.undo();

    expect(store.getValue()).toEqual(steps[1]);

    history.undo();

    expect(store.getValue()).toEqual(steps[0]);
  });

  it('should replace store on undo/redo', () => {
    const { state, config } = createState(withProps({ counter: 5 }));
    const store = new Store({ state, config, name: '' });
    const history = stateHistory(store);

    expect((history as any).history).toEqual({
      past: [],
      present: { counter: 5 },
      future: [],
    });
    expect(store.getValue()).toEqual({ counter: 5 });

    store.update((state) => ({
      ...state,
      newProperty: true,
    }));

    expect((history as any).history).toEqual({
      past: [{ counter: 5 }],
      present: { counter: 5, newProperty: true },
      future: [],
    });
    expect(store.getValue()).toEqual({ counter: 5, newProperty: true });

    history.undo();

    expect((history as any).history).toEqual({
      past: [],
      present: { counter: 5 },
      future: [{ counter: 5, newProperty: true }],
    });
    expect(store.getValue()).toEqual({ counter: 5 });
  });
});
