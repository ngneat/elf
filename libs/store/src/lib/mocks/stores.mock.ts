import { createState } from '../core/state';
import { withEntities } from '../entity/entity.state';
import { Store } from '@eleanor/store';

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

export const createEntitieStore = () => new Store({ state, name: 'todos', config });
