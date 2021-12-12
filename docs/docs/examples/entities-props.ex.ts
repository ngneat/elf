import { createState, Store } from '@ngneat/elf';
import {
  withEntities,
  entitiesPropsFactory,
  upsertEntities,
  addEntities,
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

const { state, config } = createState(
  withEntities<Product>(),
  withCartEntities<CartItem>()
);

const productsStore = new Store({ name: 'products', config, state });

productsStore.subscribe((value) => {
  console.log(value);
});

productsStore.update(
  addEntities({ id: 1, title: 'one', price: 55 }),
  upsertEntities(1, {
    updater: (e) => ({ ...e, quantity: e.quantity + 1 }),
    creator: (id) => ({ id, quantity: 1 }),
    ref: cartEntitiesRef,
  })
);
