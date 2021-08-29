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
      factory.createIdentifier('withRequestsStatus'),
      undefined,
      []
    );
  }

  run() {
    this.addImport(
      [
        'withRequestsStatus',
        'selectRequestStatus',
        'updateRequestsStatus',
        'StatusState',
      ],
      '@ngneat/elf-requests'
    );

    this.repo.insertMember(0, {
      name: `status$`,
      kind: StructureKind.Property,
      initializer: `store.pipe(selectRequestStatus('key'))`,
    });

    this.repo.addMember({
      name: `updateRequestStatus`,
      kind: StructureKind.Method,
      parameters: [{ name: 'state', type: 'StatusState' }],
      statements: `store.reduce(updateRequestsStatus({ key: state }));`,
    });
  }
}
