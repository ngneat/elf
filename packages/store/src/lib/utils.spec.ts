import { deepFreeze } from './utils';

class SpecialObject {
  specialString = 'special';
  specialNumber = 2;

  constructor(params: Partial<ComplexState>) {
    Object.assign(this, params);
  }
}

class ComplexState {
  propertyString = '';
  propertyNumber = 1;
  specialObject: SpecialObject = new SpecialObject({});

  constructor(params: Partial<ComplexState>) {
    Object.assign(this, params);
  }
}

describe('deepFreeze', () => {
  it('should freeze all properties', () => {
    const state = new ComplexState({});

    deepFreeze(state);

    expect(Object.isFrozen(state.propertyNumber)).toBeTruthy();
    expect(Object.isFrozen(state.propertyString)).toBeTruthy();
    expect(Object.isFrozen(state.specialObject)).toBeTruthy();
    expect(Object.isFrozen(state.specialObject.specialNumber)).toBeTruthy();
    expect(Object.isFrozen(state.specialObject.specialString)).toBeTruthy();
  });
});
