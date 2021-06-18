import { Component } from '@angular/core';
import { TodosRepository } from './state/todos.repository';

@Component({
  selector: 'elf-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent {
  constructor(public todosRepo: TodosRepository) {}
}
