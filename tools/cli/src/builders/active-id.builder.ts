import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
import { camelize, capitalize } from '../utils';
import { factory } from 'typescript';

export class ActiveIdBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withActiveId';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier('withActiveId'),
      undefined,
      []
    );
  }

  run() {
    this.addImport(['withActiveId', 'selectActiveEntity', 'setActiveId']);

    this.repo.insertMember(0, {
      name: `active${capitalize(camelize(this.singularName))}$`,
      kind: StructureKind.Property,
      initializer: `store.pipe(selectActiveEntity())`,
    });

    this.repo.addMember({
      kind: StructureKind.Method,
      name: `setActiveId`,
      parameters: [
        {
          name: 'id',
          type: `${capitalize(this.singularName)}['${this.idKey}']`,
        },
      ],
      statements: [`store.reduce(setActiveId(id));`],
    });
  }
}
