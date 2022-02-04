import {
  excludeKeys,
  persistState,
  StateStorage,
} from '@ngneat/elf-persist-state';
import { of } from 'rxjs';
import { createEntitiesStore, createTodo } from '@ngneat/elf-mocks';
import { addEntities } from '@ngneat/elf-entities';

describe('excludeKeys', () => {
  global.window = {} as any;

  it('should exclude keys from saved state', () => {
    const storage: StateStorage = {
      getItem: jest.fn().mockImplementation(() => of(null)),
      setItem: jest.fn().mockImplementation(() => of(true)),
      removeItem: jest.fn().mockImplementation(() => of(true)),
    };

    const store = createEntitiesStore();

    persistState(store, {
      storage,
      source: () => store.pipe(excludeKeys(['entities'])),
    });
    expect(storage.setItem).not.toHaveBeenCalled();

    store.update(addEntities(createTodo(1)));
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(storage.setItem).toHaveBeenCalledWith(`todos@store`, {
      ids: [1],
    });
  });
});
