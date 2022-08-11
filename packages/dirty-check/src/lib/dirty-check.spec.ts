import { dirtyCheck } from './dirty-check';

describe('dirtyCheck', () => {
  it('should work', () => {
    expect(dirtyCheck()).toEqual('dirty-check');
  });
});
