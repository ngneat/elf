export interface Options {
  storeName: string;
  features: Array<Features>;
  crud: Array<'addEntities' | 'updateEntities' | 'deleteEntities'>;
  idKey: string;
  path: string;
}

export type Features = typeof baseFeatures[number]['value'];

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
    name: 'Cache Status',
    value: 'withCacheStatus',
  },
  {
    name: 'Status',
    value: 'withStatus',
  },
] as const;
