import { Store } from '@eleanor/store';

export const defaultEntitiesKey = '$entities' as const;
export const defaultIdsKey = '$ids' as const;

export class EntitiesRef<EntitiesKey extends string = any, IdsKey extends string = any> {
  entitiesKey: EntitiesKey;
  idsKey: IdsKey;

  constructor(private config: { entitiesKey: EntitiesKey, idsKey: IdsKey }) {
    this.entitiesKey = config.entitiesKey ?? defaultEntitiesKey;
    this.idsKey = config.idsKey ?? defaultIdsKey;
  }
}

export const defaultEntitiesRef = new EntitiesRef({ entitiesKey: defaultEntitiesKey, idsKey: defaultIdsKey });

export const entitiesUIRef = new EntitiesRef({
  entitiesKey: '$UIEntities',
  idsKey: '$UIIds'
});

export function withEntitiesFactory<S extends EntitiesRecord,
  Ref extends EntitiesRef,
  >(ref: Ref) {
  return {
    [ref.entitiesKey]: {},
    [ref.idsKey]: []
  } as unknown as {
    [P in Ref['entitiesKey'] | Ref['idsKey']]: S[P]
  };
}

export function withEntities<EntityType, IdType extends PropertyKey>(config: Partial<Config> = {}) {
  return {
    state: withEntitiesFactory<EntityState<EntityType, IdType>, typeof defaultEntitiesRef>(defaultEntitiesRef),
    config: {
      idKey: config?.idKey ?? 'id'
    }
  };
}

export function withUIEntities<EntityType, IdType extends PropertyKey>(config: Partial<Config> = {}) {
  return {
    state: withEntitiesFactory<UIEntityState<EntityType, IdType>, typeof entitiesUIRef>(entitiesUIRef),
    config: {
      idKey: config?.idKey ?? 'id'
    }
  };
}

export function getIdKey<T>(store: Store): T {
  return store.getConfig<Config>().idKey as unknown as T;
}

export interface EntityState<EntityType = any, IdType extends PropertyKey = any> {
  $entities: Record<IdType, EntityType>;
  $ids: Array<IdType>;
}

export interface UIEntityState<EntityType = any,
  IdType extends PropertyKey = any> {
  $UIEntities: Record<IdType, EntityType>;
  $UIIds: Array<IdType>;
}

interface Config {
  idKey: string;
}

export type getEntityType<S extends EntitiesRecord, Ref extends EntitiesRef> = S[Ref['entitiesKey']][0];
export type getIdType<S extends EntitiesRecord, Ref extends EntitiesRef> = S[Ref['idsKey']][0];
export type ItemPredicate<Item> = (item: Item, index?: number) => boolean;
export type EntitiesRecord = Record<any, any>;
export type DefaultEntitiesRef = typeof defaultEntitiesRef;

export interface BaseEntityOptions<Ref extends EntitiesRef> {
  ref?: Ref;
}
