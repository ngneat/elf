export enum Actions {
  Set = 'Set',
  Add = 'Add',
  Update = 'Update',
  Remove = 'Remove',
}

export interface Action<IDType> {
  type: Actions;
  ids: IDType[];
}
