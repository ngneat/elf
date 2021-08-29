import { Component, OnInit } from '@angular/core';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Component({
  selector: 'elf-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users$ = this.usersRepo.users$;
  status$ = this.usersRepo.status$;

  constructor(
    private usersRepo: UsersRepository,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe();
  }
}
