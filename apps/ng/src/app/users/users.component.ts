import { Component, inject, OnInit } from '@angular/core';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Component({
  selector: 'elf-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);

  users$ = inject(UsersRepository).users$;

  ngOnInit() {
    this.usersService.getUsers().subscribe();
  }
}
