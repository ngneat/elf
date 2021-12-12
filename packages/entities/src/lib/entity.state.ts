import { ReducerContext, capitalize } from '@ngneat/elf';
import { buildEntities } from './entity.utils';

export function getIdKey<T>(context: ReducerContext, ref: EntitiesRef): T {
  return context.config[ref.idKeyRef];
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

export class EntitiesRef<
  EntitiesKey extends string = string,
  IdsKey extends string = string,
  IdKey extends string = string
> {
  entitiesKey: EntitiesKey;
  idsKey: IdsKey;
  idKeyRef = 'idKey';

  constructor(config: {
    entitiesKey: EntitiesKey;
    idsKey: IdsKey;
    idKeyRef: IdKey;
  }) {
    this.entitiesKey = config.entitiesKey;
    this.idsKey = config.idsKey;
    this.idKeyRef = config.idKeyRef;
  }
}

export function entitiesPropsFactory<
  Feature extends string,
  IdKeyRef extends `idKey${Capitalize<Feature>}`,
  EntitiesKey extends string = Feature extends ''
    ? `entities`
    : `${Feature}Entities`,
  IdsKey extends string = Feature extends '' ? `ids` : `${Feature}Ids`
>(feature: Feature) {
  const idKeyRef = feature ? `idKey${capitalize(feature)}` : 'idKey';

  const ref = new EntitiesRef<
    Feature extends '' ? 'entities' : `${Feature}Entities`,
    Feature extends '' ? 'ids' : `${Feature}Ids`,
    Feature extends '' ? `idKey` : IdKeyRef
  >({
    entitiesKey: feature ? `${feature}Entities` : ('entities' as any),
    idsKey: feature ? `${feature}Ids` : ('ids' as any),
    idKeyRef: idKeyRef as unknown as IdKeyRef as any,
  });

  function propsFactory<
    EntityType extends { [P in IdKey]: PropertyKey },
    IdKey extends string = 'id'
  >(config?: { initialValue?: Array<EntityType>; idKey?: IdKey }) {
    let entities = {};
    let ids = [];
    const idKey = config?.idKey || ('id' as IdKey);

    if (config?.initialValue) {
      ({ ids, asObject: entities } = buildEntities<any, any>(
        config.initialValue,
        idKey
      ));
    }

    return {
      props: {
        [ref.entitiesKey]: entities,
        [ref.idsKey]: ids,
      } as {
        [K in EntitiesKey | IdsKey]: K extends EntitiesKey
          ? Record<EntityType[IdKey], EntityType>
          : K extends IdsKey
          ? Array<EntityType[IdKey]>
          : never;
      },
      config: {
        [idKeyRef]: idKey,
      } as {
        [K in IdKeyRef]: IdKey;
      },
    };
  }

  return {
    [`${feature}EntitiesRef`]: ref,
    [`with${capitalize(feature)}Entities`]: propsFactory,
  } as {
    [K in
      | `${Feature}EntitiesRef`
      | `with${Capitalize<Feature>}Entities`]: K extends `${Feature}EntitiesRef`
      ? typeof ref
      : K extends `with${Capitalize<Feature>}Entities`
      ? typeof propsFactory
      : never;
  };
}

export const { withEntities, EntitiesRef: defaultEntitiesRef } =
  entitiesPropsFactory('');
export const { UIEntitiesRef, withUIEntities } = entitiesPropsFactory('UI');
