export interface Options {
  storeName: string;
  features: Array<typeof baseFeatures[number]['value']>;
  crud: Array<'addEntities' | 'updateEntities' | 'removeEntities'>;
  idKey: string;
  path: string;
}

export const baseFeatures = [
  { name: 'Props', value: 'withProps' },
  { name: 'Entities', value: 'withEntities' },
  {
    name: 'UIEntities',
    value: 'withUIEntities',
  },
  {
    name: 'Active Id',
    value: 'withActiveId',
  },
  {
    name: 'Active Ids',
    value: 'withActiveIds',
  },
  {
    name: 'Cache',
    value: 'withCache',
  },
  {
    name: 'Status',
    value: 'withStatus',
  },
] as const;
