import { Component } from '@angular/core';

@Component({
  selector: 'elf-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  navItems = ['Todos', 'Users', 'Contacts'];

}
