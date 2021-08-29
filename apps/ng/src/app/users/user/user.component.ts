import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../users.service';
import { UsersRepository } from '../users.repository';

@Component({
  template: `
    <h1>Status: {{ status$ | async | json }}</h1>

    <h1>User: {{ user$ | async | json }}</h1>
  `,
})
export class UserComponent implements OnInit {
  id = this.router.snapshot.params.id;
  user$ = this.usersRepository.user$(this.id);

  status$ = this.usersRepository.userStatus$(this.router.snapshot.params.id);

  constructor(
    private router: ActivatedRoute,
    private usersService: UsersService,
    private usersRepository: UsersRepository
  ) {}

  ngOnInit() {
    this.usersService.getUser(this.id).subscribe();
  }
}
