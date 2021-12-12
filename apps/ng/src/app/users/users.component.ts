import { Component, OnInit } from '@angular/core';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Component({
  selector: 'elf-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  dataSource = this.usersRepo.dataSource.data$();

  constructor(
    public usersRepo: UsersRepository,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.usersService.getUsers().subscribe();
  }
}
