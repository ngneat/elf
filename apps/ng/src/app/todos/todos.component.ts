import { Component } from '@angular/core';
import { TodosRepository } from './state/todos.repository';

@Component({
  selector: 'eleanor-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent {
  constructor(public todosRepo: TodosRepository) {}
}
