import { createRepo } from '../builders/repo-builder';
import { baseFeatures } from '../types';

describe('Repo Builder', () => {
  it('withProps', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withProps'],
      crud: [],
      template: 'class',
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withProps');
  });

  it('withProps in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withProps'],
      crud: [],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withProps in a class');
  });

  it('withRequestsCache', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withRequestsCache'],
      crud: [],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('withRequestsCache');
  });

  it('withRequestsCache in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withRequestsCache'],
      crud: [],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withRequestsCache in a class');
  });

  it('withRequestsStatus', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withRequestsStatus'],
      crud: [],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('withRequestsStatus');
  });

  it('withRequestsStatus in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withRequestsStatus'],
      crud: [],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withRequestsStatus in a class');
  });

  it('withActiveId', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withActiveId'],
      crud: [],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('withActiveId');
  });

  it('withActiveId in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withActiveId'],
      crud: [],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withActiveId in a class');
  });

  it('withActiveIds', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withActiveIds'],
      crud: [],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('withActiveIds');
  });

  it('withActiveIds in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withActiveIds'],
      crud: [],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withActiveIds in a class');
  });

  it('withEntities', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withEntities'],
      crud: ['addEntities', 'updateEntities', 'deleteEntities'],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('withEntities');
  });

  it('withEntities in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withEntities'],
      crud: [],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withEntities in a class');
  });

  it('withEntities idKey', () => {
    const output = createRepo({
      idKey: '_id',
      features: ['withEntities'],
      crud: ['addEntities', 'updateEntities', 'deleteEntities'],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('withEntities');
  });

  it('withEntities idKey in a class', () => {
    const output = createRepo({
      idKey: '_id',
      features: ['withEntities'],
      crud: ['addEntities', 'updateEntities', 'deleteEntities'],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withEntities in a class');
  });

  it('withUIEntities', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withUIEntities'],
      crud: [],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('withUIEntities');
  });

  it('withUIEntities in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withUIEntities'],
      crud: [],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('withUIEntities in a class');
  });

  it('all', () => {
    const output = createRepo({
      idKey: 'id',
      features: baseFeatures.map(({ value }) => value),
      crud: ['deleteEntities', 'addEntities', 'updateEntities'],
      storeName: 'todos',
      path: '',
      template: 'class',
    });

    expect(output).toMatchSnapshot('all');
  });

  it('all in a class', () => {
    const output = createRepo({
      idKey: 'id',
      features: baseFeatures.map(({ value }) => value),
      crud: ['deleteEntities', 'addEntities', 'updateEntities'],
      template: 'class',
      inlineStoreInClass: true,
      storeName: 'todos',
      path: '',
    });

    expect(output).toMatchSnapshot('all in a class');
  });

  it('should support function template', () => {
    const output = createRepo({
      idKey: 'id',
      features: baseFeatures.map(({ value }) => value),
      crud: ['deleteEntities', 'addEntities', 'updateEntities'],
      storeName: 'todos',
      path: '',
      template: 'functions',
    });

    expect(output).toMatchSnapshot('all');
  });
});
