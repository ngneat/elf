import { SourceFile } from 'ts-morph';

export interface Options {
  storeName: string;
  features: Array<Features>;
  crud: Array<
    'addEntities' | 'updateEntities' | 'deleteEntities' | 'setEntities'
  >;
  path: string;
  idKey: string;
  template?: 'class' | 'functions';
  inlineStoreInClass?: boolean;
  hooks?: Array<Hooks>;
}

export interface Hooks {
  post?(options: {
    sourceFile: SourceFile;
    options: Omit<Options, 'hooks'>;
    repoName: string;
  }): void;
}

export interface GlobalConfig {
  cli?: {
    repoTemplate?: Options['template'];
    inlineStoreInClass?: Options['inlineStoreInClass'];
    idKey?: Options['idKey'];
    repoLibrary?: string;
    plugins?: string[];
    fuzzypath?: {
      rootPath?: string;
      excludeFilter?: Function;
      excludePath?: Function;
    };
  };
}

export type Features = typeof baseFeatures[number]['value'];

export const baseClassStorePlaces = [
  { name: 'Outside of a class', value: false },
  { name: 'Inside a class constructor', value: true },
] as const;

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

export const DEFAULT_ID_KEY = 'id';
