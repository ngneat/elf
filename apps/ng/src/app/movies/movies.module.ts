import { NgModule } from '@angular/core';
import { MoviesComponent } from './movies.component';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';

const routes: Routes = [{ path: '', component: MoviesComponent }];

@NgModule({
  declarations: [MoviesComponent],
  imports: [RouterModule.forChild(routes), CommonModule],
})
export class MoviesModule {}
