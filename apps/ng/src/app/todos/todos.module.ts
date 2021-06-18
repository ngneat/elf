import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { TodosRoutingModule } from './todos-routing.module';
import { TodosComponent } from './todos.component';

const routes: Routes = [{ path: '', component: TodosComponent }];

@NgModule({
  declarations: [TodosComponent],
  imports: [CommonModule, TodosRoutingModule, RouterModule.forChild(routes)],
})
export class TodosModule {}
