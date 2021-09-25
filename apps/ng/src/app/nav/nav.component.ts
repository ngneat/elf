import { Component } from '@angular/core';

@Component({
  selector: 'elf-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  navItems = [
    { label: 'Todos', link: 'todos' },
    { label: 'Users', link: 'users' },
    { label: 'Contacts', link: 'contacts' },
    { label: 'Gallery', link: 'gallery' },
    { label: 'Movies', link: 'movies' },
  ];
}
