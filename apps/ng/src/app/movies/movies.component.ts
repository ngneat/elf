import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'elf-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  movies = [
    {
      id: 468569,
      title: 'The Dark Knight',
      genres: [1, 3, 4],
      actors: ['Christian', 'Bale'],
    },
    {
      id: 482571,
      title: 'The Prestige',
      genres: [4, 5, 6],
      actors: ['Michael', 'Caine'],
    },
    {
      id: 1430132,
      title: 'The Wolverine',
      genres: [1, 2, 6],
      actors: ['Heath', 'Ledger'],
    },
  ];

  genres = [
    {
      id: 1,
      name: 'Action',
    },
    {
      id: 2,
      name: 'Adventure',
    },
    {
      id: 3,
      name: 'Crime',
    },
    {
      id: 4,
      name: 'Drama',
    },
    {
      id: 5,
      name: 'Mystery',
    },
    {
      id: 6,
      name: 'Sci-Fi',
    },
  ];

  result = [468569, 482571, 1430132];

  actors = [
    {
      id: 288,
      name: 'Christian Bale',
    },
    {
      id: 323,
      name: 'Michael Caine',
    },
    {
      id: 5132,
      name: 'Heath Ledger',
    },
    {
      id: 413168,
      name: 'Hugh Jackman',
    },
    {
      id: 3822462,
      name: 'Rila Fukushima',
    },
    {
      id: 5148840,
      name: 'Tao Okamoto',
    },
  ];

  isLoading = false;

  constructor() {
    console.log('');
  }

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }
}
