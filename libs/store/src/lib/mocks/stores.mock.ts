import { createState } from '../core/state';
import { Store } from '../core/store';
import { withEntities } from '../entity/entity.state';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

const { state, config } = createState(
  withEntities<Todo, Todo['id']>()
);

export function createTodo(id: number): Todo {
  return {
    id,
    title: `todo ${id}`,
    completed: false
  }
}

export function toMatchSnapshot(expect: any, store: Store) {
  return expect(store.getValue()).toMatchSnapshot();
}

export const createEntitieStore = () => new Store({ state, name: 'todos', config });
