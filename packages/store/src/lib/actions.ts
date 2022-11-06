export enum EntityActions {
  Set = 'Set',
  Add = 'Add',
  Update = 'Update',
  Remove = 'Remove',
}

export interface Action<IDType> {
  type: EntityActions;
  ids: IDType[];
}
