export interface Options {
  storeName: string;
  features: Array<Features>;
  crud: Array<
    'addEntities' | 'updateEntities' | 'deleteEntities' | 'setEntities'
  >;
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
    name: 'Requests Cache',
    value: 'withRequestsCache',
  },
  {
    name: 'Requests Status',
    value: 'withRequestsStatus',
  },
] as const;
