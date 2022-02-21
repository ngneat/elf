import { createStore } from '@ngneat/elf';
import {
  addEntities,
  entitiesPropsFactory,
  upsertEntitiesById,
  withEntities,
} from '@ngneat/elf-entities';

const { cartEntitiesRef, withCartEntities } = entitiesPropsFactory('cart');

interface Product {
  id: number;
  title: string;
  price: number;
}

interface CartItem {
  id: Product['id'];
  quantity: number;
}

const productsStore = createStore(
  { name: 'products' },
  withEntities<Product>(),
  withCartEntities<CartItem>()
);

productsStore.subscribe((value) => {
  console.log(value);
});

productsStore.update(
  addEntities({ id: 1, title: 'one', price: 55 }),
  upsertEntitiesById(1, {
    updater: (e) => ({ ...e, quantity: e.quantity + 1 }),
    creator: (id) => ({ id, quantity: 1 }),
    ref: cartEntitiesRef,
  })
);
