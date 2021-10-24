import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
import { factory } from 'typescript';

export class RequestsStatusBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withRequestsStatus';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier(`withRequestsStatus<'${this.storeName}'>`),
      undefined,
      []
    );
  }

  run() {
    this.addImport(['withRequestsStatus'], '@ngneat/elf-requests');
  }
}
