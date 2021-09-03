import { createEntitiesStore } from '../mocks/stores.mock';
import { getStoresSnapshot } from './registry';

describe('registry', () => {
  it('should getStoresSnapshot', () => {
    expect(getStoresSnapshot()).toStrictEqual({});

    const store = createEntitiesStore();

    expect(getStoresSnapshot()).toStrictEqual({
      todos: {
        entities: {},
        ids: [],
      },
    });

    store.destroy();

    expect(getStoresSnapshot()).toStrictEqual({});
  });
});
