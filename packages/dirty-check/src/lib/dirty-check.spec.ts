import { dirtyCheck } from './dirty-check';
import { createStore, setProps, withProps } from '@ngneat/elf';

interface TestProps {
  item1?: number;
  item2?: {
    item21?: number;
    item22?: {
      item221?: number;
    };
  };
  item3?: number;
}

describe('dirty check', () => {
  const initialState: TestProps = {
    item1: 1,
    item2: {
      item21: 2,
      item22: {
        item221: 3,
      },
    },
  };

  const store = createStore(
    { name: 'test' },
    withProps<TestProps>(initialState)
  );
  beforeEach(() => {
    store.reset();
  });

  it('should not be dirty from start', () => {
    const dirty = dirtyCheck(store);
    expect(dirty.isDirty()).toEqual(false);
  });

  it('should set head', () => {
    const dirty = dirtyCheck(store);
    store.update(setProps({ item1: 2 }));
    expect(dirty.isDirty()).toEqual(true);
    dirty.setHead();
    expect(dirty.isDirty()).toEqual(false);
  });

  it('should get the head', () => {
    const dirty = dirtyCheck(store);
    store.update(setProps({ item1: 2 }));
    expect(dirty.getHead()).toEqual(initialState);
  });

  it('should get combined state of keys if watch is used', () => {
    const dirty = dirtyCheck(store, {
      watch: ['item1', 'item3'],
    });
    store.update(setProps({ item1: 1, item3: 3 }));
    dirty.setHead();
    expect(dirty.getHead()).toEqual({ item1: 1, item3: 3 });
  });

  it('should reset dirty state', () => {
    const dirty = dirtyCheck(store);
    store.update(setProps({ item1: 2 }));
    expect(dirty.isDirty()).toEqual(true);
    dirty.reset();
    expect(dirty.isDirty()).toEqual(false);
  });

  it('should not trigger dirty if changing prop outside watch', () => {
    const dirty = dirtyCheck(store, {
      watch: ['item2'],
    });
    // should not trigger dirty state
    store.update(setProps({ item1: 2 }));
    expect(dirty.isDirty()).toEqual(false);
  });

  it('should trigger dirty when changing prop inside watch', () => {
    const dirty = dirtyCheck(store, {
      watch: ['item2'],
    });
    // should not trigger dirty state
    store.update(
      setProps((state) => ({
        item2: {
          ...state.item2,
          item21: 21,
        },
      }))
    );
    expect(dirty.isDirty()).toEqual(true);
  });

  it('should set new head when using watch', () => {
    const dirty = dirtyCheck(store, {
      watch: ['item2'],
    });
    dirty.setHead();
    store.update(
      setProps((state) => ({
        item2: {
          ...state.item2,
          item21: 21,
        },
      }))
    );
    expect(dirty.isDirty()).toEqual(true);
    dirty.setHead();
    expect(dirty.isDirty()).toEqual(false);
  });
});
