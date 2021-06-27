import {createState, Store} from '../core';
import {addEntities, updateEntities, withEntities} from '../entities';
import {
  removeActiveIds,
  selectActiveEntities,
  selectActiveEntity,
  selectActiveId, selectActiveIds,
  setActiveId, setActiveIds, setActivetest, toggleActiveIds,
  withActiveId, withActiveIds,
} from './active-id';

describe('activeId', () => {
  it('should select the active entity', () => {
    const {state, config} = createState(
      withEntities<{ id: number; title: string }>(),
      withActiveId()
    );

    const store = new Store({state, config, name: ''});

    const spy = jest.fn();
    store.pipe(selectActiveId()).subscribe((v) => {
    });
    store.pipe(selectActiveEntity()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith(undefined);

    store.reduce(addEntities({id: 1, title: ''}));

    store.reduce(setActiveId(1));
    expect(spy).toHaveBeenCalledWith({id: 1, title: ''});

    store.reduce(addEntities({id: 2, title: ''}));
    expect(spy).toHaveBeenCalledTimes(2);

    store.reduce(updateEntities(1, {title: 'foo'}));
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({id: 1, title: 'foo'});
  });
});


describe('activeIds', () => {
  it('should select the active entities', () => {
    const {state, config} = createState(
      withEntities<{ id: number; title: string }>(),
      withActiveIds()
    );

    const store = new Store({state, config, name: ''});

    const spy = jest.fn();
    store.pipe(selectActiveEntities()).subscribe(spy);
    expect(spy).toHaveBeenCalledWith([]);

    store.reduce(addEntities({id: 1, title: ''}));
    store.reduce(setActiveIds([1]));
    expect(spy).toHaveBeenCalledWith([{id: 1, title: ''}]);

    store.reduce(addEntities({id: 2, title: ''}));
    expect(spy).toHaveBeenCalledTimes(2);

    store.reduce(updateEntities(1, {title: 'foo'}));
    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith([{id: 1, title: 'foo'}]);

    store.reduce(removeActiveIds(1));
    expect(spy).toHaveBeenCalledWith([]);

    store.reduce(addEntities({id: 3, title: '3'}));
    store.reduce(toggleActiveIds(3));
    expect(spy).toHaveBeenCalledWith([{id: 3, title: '3'}]);
  });
});
