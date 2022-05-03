import { AddTodo } from './add-todo/add-todo';
import { useObservable } from '@ngneat/use-observable';
import {
  addTodo,
  deleteTodo,
  removeAll,
  completeAllTodos,
  setTodos,
  visibleTodos$,
  updateTodoCompleted,
  updateTodosFilter,
  removedEntities$,
  actions$,
  settedEntities$,
  addedEntities$,
} from './todos.repository';
import { TodoItem } from './todo/todo';
import { Filters } from './filters/filters';
import { useEffect } from 'react';

export function TodosPage() {
  const [todos] = useObservable(visibleTodos$);

  const setTodosSample = () => {
    setTodos([
      { id: '06615f29', text: 'Todo 0', completed: false },
      { id: '83dc1aa0', text: 'Todo 1', completed: false },
      { id: 'ff9b516f', text: 'Todo 2', completed: true },
    ]);
  };

  useEffect(() => {
    actions$.subscribe((action) => {
      console.log('Store entities actions', action);
    });

    removedEntities$.subscribe((action) => {
      console.log('Entities removed', action);
    });

    settedEntities$.subscribe((action) => {
      console.log('Entities setted', action);
    });

    addedEntities$.subscribe((action) => {
      console.log('Entities added', action);
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-2">Todos</h1>

      <AddTodo onAdd={addTodo} />

      <Filters onChange={updateTodosFilter} />

      <span>Actions: </span>
      <div className="btn-group">
        <button
          onClick={setTodosSample}
          className="btn btn-secondary flex-shrink-0"
        >
          Set sample entities
        </button>

        <button
          onClick={completeAllTodos}
          className="btn btn-secondary flex-shrink-0"
        >
          Complete all
        </button>

        <button onClick={removeAll} className="btn btn-danger flex-shrink-0">
          Remove all
        </button>
      </div>

      <section className="my-6">
        <ul className="list-group">
          {todos.map((todo) => (
            <TodoItem
              {...todo}
              key={todo.id}
              onClick={updateTodoCompleted}
              onDelete={deleteTodo}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

export default TodosPage;
