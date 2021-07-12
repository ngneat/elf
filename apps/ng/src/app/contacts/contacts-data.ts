import * as faker from 'faker';
import { sortBy as lodashSortBy } from 'lodash';

const count = 96;
const data: any[] = [];

for (let i = 0; i < count; i++) {
  data.push({
    id: faker.datatype.number(),
    email: faker.internet.email(),
    name: faker.name.findName(),
    address: faker.address.streetAddress(),
  });
}

export function getData(options: any) {
  console.log('Fetching from server');
  const { page, sortBy, perPage } = {
    sortBy: 'email',
    perPage: 10,
    page: 1,
    ...options,
  } as any;

  const offset = (page - 1) * +perPage;
  const sorted = lodashSortBy(data, sortBy);
  const paginatedItems = sorted.slice(offset, offset + +perPage);

  return {
    currentPage: page,
    perPage: +perPage,
    total: data.length,
    lastPage: Math.ceil(data.length / +perPage),
    data: paginatedItems,
  };
}

export function generatePages(total: number, perPage: number) {
  const len = Math.ceil(total / perPage);
  const arr = [];

  for (let i = 0; i < len; i++) {
    arr.push(i + 1);
  }

  return arr;
}
