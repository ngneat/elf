import { Component, OnInit } from '@angular/core';
import { GalleryItem, GalleryRepository, GalleryUIItem } from './state/gallery.repository';
import { GalleryService } from './state/gallery.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'elf-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  items$: Observable<(GalleryItem & GalleryUIItem)[]> | null;

  constructor(    private service: GalleryService,
                  public galleryRepo: GalleryRepository) {
    this.items$ = null;
  }

  toggleItemOpen(galleryItemId: number) {
    this.galleryRepo.toggleItemOpen(galleryItemId);
  }

  trackByFn(index: number, item: GalleryItem) {
    return item.id;
  }

  ngOnInit(): void {
    this.service.getGalleryItems().subscribe();
    this.items$ = this.galleryRepo.items$;
  }
}