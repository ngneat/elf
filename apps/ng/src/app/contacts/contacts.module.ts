import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';

const routes: Routes = [{ path: '', component: ContactsComponent }];

@NgModule({
  declarations: [ContactsComponent],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ContactsRoutingModule,
    RouterModule.forChild(routes),
  ],
})
export class ContactsModule {}
