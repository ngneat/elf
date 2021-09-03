import * as faker from 'faker';

const count = 10;
const data: any[] = [];

for (let i = 0; i < count; i++) {
  data.push({
    id: faker.datatype.number(),
    image: faker.image.imageUrl(500, 350, undefined, true),
    description: `By ${faker.name.firstName()} ${faker.name.lastName()}. This work is all about man's quest to ${faker.company.bs()}.`,
    title: `The ${faker.company.bsAdjective()} ${faker.company.bsNoun()}`,
  });
}

export function getData() {
  return data;
}
