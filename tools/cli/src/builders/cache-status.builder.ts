import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
import { factory } from 'typescript';

export class CacheStatusBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withCacheStatus';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier('withCacheState'),
      undefined,
      []
    );
  }

  run() {
    this.addNamedImport([
      'withCacheStatus',
      'selectCacheStatus',
      'setCacheStatus',
      'CacheStatus',
    ]);

    this.repo.insertMember(0, {
      name: `cacheStatus$`,
      kind: StructureKind.Property,
      initializer: `store.pipe(selectCacheStatus())`,
    });

    this.repo.addMember({
      name: `updateCacheStatus`,
      kind: StructureKind.Method,
      parameters: [{ name: 'value', type: 'CacheStatus' }],
      statements: `store.reduce(setCacheStatus(value));`,
    });
  }
}
