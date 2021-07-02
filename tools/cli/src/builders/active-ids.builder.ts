import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
import { camelize, capitalize } from '../utils';
import { factory } from 'typescript';

export class ActiveIdsBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withActiveIds';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier('withActiveIds'),
      undefined,
      []
    );
  }

  run() {
    this.addNamedImport([
      'withActiveIds',
      'selectActiveEntities',
      'toggleActiveIds',
    ]);

    this.repo.insertMember(0, {
      name: `active${capitalize(camelize(this.storeName))}$`,
      kind: StructureKind.Property,
      initializer: `store.pipe(selectActiveEntities())`,
    });

    this.repo.addMember({
      kind: StructureKind.Method,
      name: `toggleActiveIds`,
      parameters: [
        {
          name: 'ids',
          type: `Array<${capitalize(this.singularName)}['${this.idKey}']>`,
        },
      ],
      statements: [`store.reduce(toggleActiveIds(ids));`],
    });
  }
}
