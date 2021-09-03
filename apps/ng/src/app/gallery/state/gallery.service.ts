import { Injectable } from '@angular/core';
import { getData } from '../gallery-data';
import { timer } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GalleryRepository } from './gallery.repository';
import { setRequestStatus } from '@ngneat/elf-requests';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  constructor(private repo: GalleryRepository) {}

  getGalleryItems() {
    return timer(300).pipe(
      map(() => getData()),
      tap((res) => this.repo.addGalleryItems(res)),
      setRequestStatus(this.repo.store, 'gallery'),
    );
  }
}
