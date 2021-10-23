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
      factory.createIdentifier(`withRequestsCache<'${this.storeName}'>`),
      undefined,
      []
    );
  }

  run() {
    this.addImport(
      [
        'withRequestsCache',
        'updateRequestCache',
        'CacheState',
        'createRequestsCacheOperator',
      ],
      '@ngneat/elf-requests'
    );

    this.repo.addMember({
      name: this.isFunctionsTpl
        ? `update${this.storeNames.className}RequestCache`
        : `updateRequestCache`,
      kind: StructureKind.Method,
      parameters: [
        { name: 'keys', type: `'${this.storeName}'` },
        { name: 'state', type: 'CacheState' },
      ],
      statements: `${this.storeVariableName}.update(updateRequestCache(key, state));`,
    });

    this.repo.insertMember(0, {
      name: `skipWhile${this.storeNames.className}Cached`,
      kind: StructureKind.Property,
      initializer: `createRequestsCacheOperator(${this.storeVariableName})`,
    });
  }
}
