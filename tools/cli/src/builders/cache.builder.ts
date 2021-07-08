import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
import { factory } from 'typescript';

export class CacheBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withCache';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier('withCache'),
      undefined,
      []
    );
  }

  run() {
    this.addNamedImport(['withCache', 'updateCache', 'CacheStatus']);

    this.repo.addMember({
      name: `updateCache`,
      kind: StructureKind.Method,
      parameters: [{ name: 'value', type: 'CacheStatus' }],
      statements: `store.reduce(updateCache(value));`,
    });
  }
}
