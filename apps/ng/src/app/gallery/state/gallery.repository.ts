import { Injectable } from '@angular/core';
import {
  addEntities,
  createState,
  intersectEntities,
  selectAll,
  selectEntities,
  Store,
  UIEntitiesRef,
  updateEntities,
  withEntities,
  withUIEntities,
} from '@ngneat/elf';
import { withRequestsStatus } from '@ngneat/elf-requests';

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
