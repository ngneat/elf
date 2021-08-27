import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { Router, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'login', component: LoginComponent, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  declarations: [LoginComponent]
})
export class LoginModule {}
