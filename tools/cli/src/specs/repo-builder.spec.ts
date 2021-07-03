import { createRepo } from '../builders/repo-builder';
import { baseFeatures } from '../types';

describe('Repo Builder', () => {
  it('withProps', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withProps'],
      crud: [],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withProps');
  });

  it('withCacheStatus', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withCacheStatus'],
      crud: [],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withCacheStatus');
  });

  it('withStatus', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withStatus'],
      crud: [],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withStatus');
  });

  it('withActiveId', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withActiveId'],
      crud: [],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withActiveId');
  });

  it('withActiveIds', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withActiveIds'],
      crud: [],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withActiveIds');
  });

  it('withEntities', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withEntities'],
      crud: ['addEntities', 'updateEntities', 'removeEntities'],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withEntities');
  });

  it('withEntities idKey', () => {
    const output = createRepo({
      idKey: '_id',
      features: ['withEntities'],
      crud: ['addEntities', 'updateEntities', 'removeEntities'],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withEntities');
  });

  it('withUIEntities', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withUIEntities'],
      crud: [],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withUIEntities');
  });

  it('all', () => {
    const output = createRepo({
      idKey: 'id',
      features: baseFeatures.map(({ value }) => value),
      crud: ['removeEntities', 'addEntities', 'updateEntities'],
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('all');
  });
});
