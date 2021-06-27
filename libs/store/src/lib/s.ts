import {BehaviorSubject, Observable} from "rxjs";
import {distinctUntilChanged, map} from "rxjs/operators";
import {createState, DefaultEntitiesRef, getEntityType, getIdType, withEntities, withUIEntities} from "@ngneat/elf";
import {
  BaseEntityOptions,
  defaultEntitiesRef,
  EntitiesRef,
  EntitiesState,
  entitiesUIRef
} from "./entities/entity.state";
import {OrArray} from "./core/types";
import {untilEntitiesChanges} from "./entities/all.query";


interface StoreDef<State = any> {
  name: string;
  state: State;
  config: any;
}

export class Store<SDef extends StoreDef = any,
  State = SDef['state']> {
  private source!: BehaviorSubject<State>;
  value$: Observable<State>;

  constructor(public storeDef: SDef) {
    this.source.next(storeDef.state);
    this.value$ = this.source.asObservable();
  }

  select<R>(mapFn: (value: State) => R): Observable<R> {
    return this.value$.pipe(map(mapFn), distinctUntilChanged())
  }

  reduce(reduceFn: (value: State) => State) {
    this.source.next(reduceFn(this.value));
  }

  get value() {
    return this.source.getValue();
  }

}

class EntityStore<Def extends StoreDef<EntitiesState<DefaultEntitiesRef>>> extends Store<Def> {

  selectAll<Ref extends EntitiesRef = DefaultEntitiesRef>(
    options?: Def['state'] extends EntitiesState<Ref> ? BaseEntityOptions<Ref> : never
  ): Observable<getEntityType<Def['state'], Ref>[]> {
    const {ref: {entitiesKey, idsKey} = defaultEntitiesRef} = (options || {});

    return this.value$.pipe(untilEntitiesChanges(entitiesKey),
      map((state) =>
        state[idsKey].map((id: getIdType<Def['state'], Ref>) => state[entitiesKey][id])
      ))
  }

  addEntities<Ref extends EntitiesRef = DefaultEntitiesRef>(
    entities: Def['state'] extends EntitiesState<Ref> ? OrArray<getEntityType<Def['state'], Ref>> : never,
    options: {
      prepend?: boolean;
    } & BaseEntityOptions<Ref> = {}
  ) {

  }
}


const {state, config} = createState(
  withEntities<{ name: string, id: number }>(),
  withUIEntities<{ open: boolean, _id: number }, '_id'>({ idKey: '_id'}),
)

const v = new EntityStore({state, name: '', config});

v.addEntities({id: 1, name: 'true'})
v.selectAll().subscribe(v => {

})

v.selectAll({ref: entitiesUIRef}).subscribe(v => {

})
