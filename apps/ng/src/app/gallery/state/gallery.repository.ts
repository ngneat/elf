import { Injectable } from '@angular/core';
import {
  addEntities,
  createState, selectAll,
  Store,
  updateEntities,
  withEntities,
  withRequestsStatus,
  withUIEntities
} from '@ngneat/elf';
import { entitiesUIRef } from '../../../../../../packages/store/src/lib/entities/entity.state';
import { selectEntities } from '../../../../../../packages/store/src/lib/entities/all.query';
import { map } from 'rxjs/operators';

export interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface GalleryUIItem {
  id: number; open: boolean
}

const { state, config } = createState(
  withEntities<GalleryItem>(),
  withUIEntities<GalleryUIItem>(),
  withRequestsStatus()
);

const store = new Store({ name: 'gallery', state, config });

@Injectable({ providedIn: 'root' })
export class GalleryRepository {
  items$ = this.store.combine([this.store.pipe(selectAll()), this.store.pipe(selectEntities({ref : entitiesUIRef}))]).pipe(
    map(([entities, uiEntities])=>entities.map((galleryItem)=>(
      {...galleryItem, open: uiEntities[galleryItem.id].open}))));

  addGalleryItems(galleryItems: GalleryItem[]) {
    const uiGalleryItems =  galleryItems.map(({id})=>({id, open: false}));
    store.reduce(
      addEntities(galleryItems),
      addEntities (uiGalleryItems, {ref: entitiesUIRef})
    );
  }

  get store() {
    return store;
  }

  toggleItemOpen(galleryItemId: number) {
    this.store.reduce(updateEntities(galleryItemId, (item)=>({...item, open: !item.open}), {ref: entitiesUIRef}))
  }
}

