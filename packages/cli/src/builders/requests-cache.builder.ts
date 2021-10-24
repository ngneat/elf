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
    this.addImport(['withRequestsCache'], '@ngneat/elf-requests');
  }
}
