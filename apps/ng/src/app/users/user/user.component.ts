import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';

@Component({
  template: `
    <ng-container *ngIf="user$ | async as user">
      <h1>Loading: {{ user.isLoading }}</h1>

      <code>User: {{ user.data | json }}</code>
    </ng-container>
  `,
})
export class UserComponent implements OnInit {
  private usersService = inject(UsersService);

  id = inject(ActivatedRoute).snapshot.params.id;
  user$ = inject(UsersRepository).getUser(this.id);

  ngOnInit() {
    setTimeout(() => {
      this.usersService.getUser(this.id).subscribe();
    }, 1500);
  }
}
