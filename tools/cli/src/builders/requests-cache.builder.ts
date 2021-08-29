import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { factory } from 'typescript';
import { StructureKind } from 'ts-morph';

export class RequestsCacheBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withRequestsCache';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier('withRequestsCache'),
      undefined,
      []
    );
  }

  run() {
    this.addImport(
      ['withRequestsCache', 'updateRequestsCache', 'CacheState'],
      '@ngneat/elf-requests'
    );

    this.repo.addMember({
      name: `updateRequestCache`,
      kind: StructureKind.Method,
      parameters: [{ name: 'state', type: 'CacheState' }],
      statements: `store.reduce(updateRequestsCache({ key: state }));`,
    });
  }
}
