import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  addEntities,
  selectAllEntities,
  selectEntities,
  UIEntitiesRef,
  unionEntities,
  updateEntities,
  withEntities,
  withUIEntities,
} from '@ngneat/elf-entities';

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface GalleryUIItem {
  id: number;
  open: boolean;
}

const store = createStore(
  { name: 'gallery' },
  withEntities<GalleryItem>(),
  withUIEntities<GalleryUIItem>()
);

@Injectable({ providedIn: 'root' })
export class GalleryRepository {
  items$ = this.store
    .combine({
      entities: store.pipe(selectAllEntities()),
      UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
    })
    .pipe(unionEntities());

  addGalleryItems(galleryItems: GalleryItem[]) {
    const uiGalleryItems = galleryItems.map(({ id }) => ({ id, open: false }));
    store.update(
      addEntities(galleryItems),
      addEntities(uiGalleryItems, { ref: UIEntitiesRef })
    );
  }

  get store() {
    return store;
  }

  toggleItemOpen(galleryItemId: number) {
    this.store.update(
      updateEntities(galleryItemId, (item) => ({ ...item, open: !item.open }), {
        ref: UIEntitiesRef,
      })
    );
  }
}
