import { arrayAdd, arrayRemove, arrayToggle, arrayUpdate } from './index';

describe('array', () => {
  describe('add', () => {
    it('should add', () => {
      const arr = [1];
      expect(arrayAdd(arr, 2)).toEqual([1, 2]);
    });

    it('should prepend', () => {
      const arr = [1];
      expect(arrayAdd(arr, 2, { prepend: true })).toEqual([2, 1]);
    });
  });

  describe('remove', () => {
    it('should remove', () => {
      const arr = [1, 2, 3];
      expect(arrayRemove(arr, 2)).toEqual([1, 3]);
    });

    it('should remove by id', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      expect(arrayRemove(arr, 1)).toEqual([{ id: 2 }, { id: 3 }]);
    });

    it('should remove by id with a different key', () => {
      const arr = [{ _id: 1 }, { _id: 2 }, { _id: 3 }];
      expect(arrayRemove(arr, 1, { idKey: '_id' })).toEqual([
        { _id: 2 },
        { _id: 3 },
      ]);
    });
  });

  describe('update', () => {
    it('should update primitive', () => {
      expect(arrayUpdate([1, 2, 3], 2, 5)).toEqual([1, 5, 3]);
    });

    it('should update by id', () => {
      expect(
        arrayUpdate(
          [
            { id: 1, title: '1' },
            { id: 2, title: '2' },
          ],
          2,
          { title: 'foo' }
        )
      ).toEqual([
        {
          id: 1,
          title: '1',
        },
        { id: 2, title: 'foo' },
      ]);
    });

    it('should update by id with a different key', () => {
      expect(
        arrayUpdate(
          [
            { _id: '1', title: '1' },
            {
              _id: '2',
              title: '2',
            },
          ],
          '2',
          { title: 'foo' },
          { idKey: '_id' }
        )
      ).toEqual([
        { _id: '1', title: '1' },
        { _id: '2', title: 'foo' },
      ]);
    });
  });

  describe('toggle', () => {
    it('should toggle', () => {
      const arr = [1, 2, 3];
      const toggled = arrayToggle(arr, 4);

      expect(toggled).toEqual([1, 2, 3, 4]);

      expect(arrayToggle(toggled, 4)).toEqual([1, 2, 3]);
    });

    it('should toggle by id', () => {
      const arr = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const toggled = arrayToggle(arr, { id: 4 });
      expect(toggled).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);

      expect(arrayToggle(toggled, { id: 4 })).toEqual([
        { id: 1 },
        { id: 2 },
        { id: 3 },
      ]);
    });

    it('should remove by id with a different key', () => {
      const arr = [{ _id: 1 }, { _id: 2 }, { _id: 3 }];
      const toggled = arrayToggle(arr, { _id: 4 }, { idKey: '_id' });
      expect(toggled).toEqual([{ _id: 1 }, { _id: 2 }, { _id: 3 }, { _id: 4 }]);

      expect(arrayToggle(toggled, { _id: 4 }, { idKey: '_id' })).toEqual([
        { _id: 1 },
        { _id: 2 },
        { _id: 3 },
      ]);
    });
  });
});
