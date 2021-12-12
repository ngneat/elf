import { Component, OnInit } from '@angular/core';
import { GalleryItem, GalleryRepository } from './state/gallery.repository';
import { GalleryService } from './state/gallery.service';

@Component({
  selector: 'elf-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
  items$ = this.galleryRepo.items$;

  constructor(
    private service: GalleryService,
    private galleryRepo: GalleryRepository
  ) {}

  toggleItemOpen(galleryItemId: number) {
    this.galleryRepo.toggleItemOpen(galleryItemId);
  }

  trackByFn(index: number, item: GalleryItem) {
    return item.id;
  }

  ngOnInit(): void {
    this.service.getGalleryItems().subscribe();
  }
}
