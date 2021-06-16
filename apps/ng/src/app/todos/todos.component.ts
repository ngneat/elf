import { Component } from '@angular/core';
import { TodosProps, TodosRepository } from './state/todos.repository';

@Component({
  selector: 'eleanor-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css']
})
export class TodosComponent {
  todos$ = this.todosRepo.visibleTodos$;

  constructor(private todosRepo: TodosRepository) {
  }

  add(title: string) {
    this.todosRepo.addTodo({ id: Math.random(), title, completed: false })
  }

  updateFilter(filter: TodosProps['filter']) {
    this.todosRepo.updateFilter(filter);
  }

  updateComplete(id: number) {
    this.todosRepo.updateCompleted(id);
  }
}
