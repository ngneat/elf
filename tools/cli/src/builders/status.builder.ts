import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
import { factory } from 'typescript';

export class StatusBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withStatus';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier('withStatus'),
      undefined,
      []
    );
  }

  run() {
    this.addNamedImport([
      'withStatus',
      'selectStatus',
      'setStatus',
      'StatusState',
    ]);

    this.repo.insertMember(0, {
      name: `status$`,
      kind: StructureKind.Property,
      initializer: `store.pipe(selectStatus())`,
    });

    this.repo.addMember({
      name: `updateStatus`,
      kind: StructureKind.Method,
      parameters: [{ name: 'value', type: 'StatusState' }],
      statements: `store.reduce(setStatus(value));`,
    });
  }
}
