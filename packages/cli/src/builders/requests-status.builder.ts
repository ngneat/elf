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
    this.addImport(
      [
        'withRequestsStatus',
        'selectRequestStatus',
        'createRequestsStatusOperator',
      ],
      '@ngneat/elf-requests'
    );

    this.repo.insertMember(0, {
      name: `status$`,
      kind: StructureKind.Property,
      initializer: `${this.storeVariableName}.pipe(selectRequestStatus('${this.storeNames.propertyName}'))`,
    });

    this.repo.insertMember(0, {
      name: `track${this.storeNames.className}RequestsStatus`,
      kind: StructureKind.Property,
      initializer: `createRequestsStatusOperator(${this.storeVariableName})`,
    });
  }
}
