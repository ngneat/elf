import { ReducerContext } from '@ngneat/elf';

const defaultEntitiesKey = 'entities' as const;
const defaultIdsKey = 'ids' as const;
const defaultIdKeyRef = 'idKey' as const;

export class EntitiesRef<
  EntitiesKey extends string = string,
  IdsKey extends string = string,
  IdKey extends string = string
> {
  entitiesKey: EntitiesKey;
  idsKey: IdsKey;
  idKeyRef = 'idKey';

  constructor(
    private config: {
      entitiesKey: EntitiesKey;
      idsKey: IdsKey;
      idKeyRef: IdKey;
    }
  ) {
    this.entitiesKey = config.entitiesKey ?? defaultEntitiesKey;
    this.idsKey = config.idsKey ?? defaultIdsKey;
    this.idKeyRef = config.idKeyRef ?? defaultIdKeyRef;
  }
}

export const defaultEntitiesRef = new EntitiesRef({
  entitiesKey: defaultEntitiesKey,
  idsKey: defaultIdsKey,
  idKeyRef: defaultIdKeyRef,
});

export const UIEntitiesRef = new EntitiesRef({
  entitiesKey: 'UIEntities',
  idsKey: 'UIIds',
  idKeyRef: 'idKeyUI',
});

export function withEntitiesFactory<
  S extends EntitiesRecord,
  Ref extends EntitiesRef
>(ref: Ref) {
  return {
    [ref.entitiesKey]: {},
    [ref.idsKey]: [],
  } as unknown as {
    [P in Ref['entitiesKey'] | Ref['idsKey']]: S[P];
  };
}

export function withEntities<
  EntityType extends { [P in IdKey]: PropertyKey },
  IdKey extends string = 'id'
>(
  config: {
    idKey: IdKey;
  } = { idKey: 'id' as IdKey }
) {
  return {
    props: withEntitiesFactory<
      EntityState<EntityType, EntityType[IdKey]>,
      typeof defaultEntitiesRef
    >(defaultEntitiesRef),
    config: {
      idKey: config.idKey,
    },
  };
}

export function withUIEntities<
  EntityType extends { [P in IdKey]: PropertyKey },
  IdKey extends string = 'id'
>(
  config: {
    idKey: IdKey;
  } = { idKey: 'id' as IdKey }
) {
  return {
    props: withEntitiesFactory<
      UIEntityState<EntityType, EntityType[IdKey]>,
      typeof UIEntitiesRef
    >(UIEntitiesRef),
    config: {
      idKeyUI: config.idKey,
    },
  };
}

export function getIdKey<T>(context: ReducerContext, ref: EntitiesRef): T {
  return context.config[ref.idKeyRef];
}

interface EntityState<EntityType, IdType extends PropertyKey> {
  entities: Record<IdType, EntityType>;
  ids: Array<IdType>;
}

interface UIEntityState<EntityType, IdType extends PropertyKey> {
  UIEntities: Record<IdType, EntityType>;
  UIIds: Array<IdType>;
}

export type getEntityType<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef
> = S[Ref['entitiesKey']][0];
export type getIdType<
  S extends EntitiesState<Ref>,
  Ref extends EntitiesRef
> = S[Ref['idsKey']][0];
export type ItemPredicate<Item> = (item: Item, index?: number) => boolean;
export type EntitiesRecord = Record<any, any>;
export type DefaultEntitiesRef = typeof defaultEntitiesRef;

type ValueOf<T> = T[keyof T];

// This will return { entitiesKey: "entities", idsKey: "ids" }
type EntitiesKeys<T> = {
  [key in keyof T]: key extends 'entitiesKey'
    ? T[key]
    : key extends 'idsKey'
    ? T[key]
    : never;
};

// This will return { entities: any, ids: any }
export type EntitiesState<T extends EntitiesRecord> = {
  [k in ValueOf<EntitiesKeys<T>>]: any;
} & {
  [key: string]: any;
};

export interface BaseEntityOptions<Ref extends EntitiesRef> {
  ref?: Ref;
}
