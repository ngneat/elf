import { createState, Store } from '@ngneat/elf';
import { withEntities, withUIEntities } from '@ngneat/elf-entities';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const { state, config } = createState(withEntities<Todo>());

export function createTodo(id: number): Todo {
  return {
    id,
    title: `todo ${id}`,
    completed: false,
  };
}

export function toMatchSnapshot(
  expect: jest.Expect,
  store: Store,
  label: string
) {
  return expect(store.getValue()).toMatchSnapshot(label);
}

export const createEntitiesStore = (name = 'todos') =>
  new Store({ state, name, config });

export function createUITodo(id: number): { id: number; open: boolean } {
  return {
    id,
    open: false,
  };
}

export interface UITodo {
  id: number;
  open: boolean;
}

export const createUIEntityStore = (name = 'UIEntityStore') =>
  new Store({
    name,
    ...createState(withUIEntities<UITodo>()),
  });
