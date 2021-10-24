import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';

@Component({
  template: `
    <ng-container *ngIf="userDataSource | async as data">
      <h1>Loading: {{ data.loading }}</h1>

      <code>User: {{ data.user | json }}</code>
    </ng-container>
  `,
})
export class UserComponent implements OnInit {
  id = this.router.snapshot.params.id;
  userDataSource = this.usersRepository.userDataSource.data$({ key: this.id });

  constructor(
    private router: ActivatedRoute,
    private usersService: UsersService,
    private usersRepository: UsersRepository
  ) {}

  ngOnInit() {
    this.usersService.getUser(this.id).subscribe();
  }
}
