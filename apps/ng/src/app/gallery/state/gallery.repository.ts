import { Injectable } from '@angular/core';
import { createState, Store } from '@ngneat/elf';
import { withRequestsStatus } from '@ngneat/elf-requests';
import {
  addEntities,
  selectAll,
  selectEntities,
  UIEntitiesRef,
  updateEntities,
  withEntities,
  withUIEntities,
  intersectEntities,
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

const { state, config } = createState(
  withEntities<GalleryItem>(),
  withUIEntities<GalleryUIItem>(),
  withRequestsStatus()
);

const store = new Store({ name: 'gallery', state, config });

@Injectable({ providedIn: 'root' })
export class GalleryRepository {
  items$ = this.store
    .combine({
      entities: store.pipe(selectAll()),
      UIEntities: store.pipe(selectEntities({ ref: UIEntitiesRef })),
    })
    .pipe(intersectEntities());

  addGalleryItems(galleryItems: GalleryItem[]) {
    const uiGalleryItems = galleryItems.map(({ id }) => ({ id, open: false }));
    store.reduce(
      addEntities(galleryItems),
      addEntities(uiGalleryItems, { ref: UIEntitiesRef })
    );
  }

  get store() {
    return store;
  }

  toggleItemOpen(galleryItemId: number) {
    this.store.reduce(
      updateEntities(galleryItemId, (item) => ({ ...item, open: !item.open }), {
        ref: UIEntitiesRef,
      })
    );
  }
}
