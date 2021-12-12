import { AddTodo } from './add-todo/add-todo';
import { useObservable } from '@ngneat/use-observable';
import {
  addTodo,
  deleteTodo,
  visibleTodos$,
  updateTodoCompleted,
  updateTodosFilter,
} from './todos.repository';
import { TodoItem } from './todo/todo';
import { Filters } from './filters/filters';

export function TodosPage() {
  const [todos] = useObservable(visibleTodos$);

  return (
    <div>
      <h1 className="text-2xl mb-2">Todos</h1>

      <AddTodo onAdd={addTodo} />

      <Filters onChange={updateTodosFilter} />

      <section>
        {todos.map((todo) => (
          <TodoItem
            {...todo}
            key={todo.id}
            onClick={updateTodoCompleted}
            onDelete={deleteTodo}
          />
        ))}
      </section>
    </div>
  );
}

export default TodosPage;
