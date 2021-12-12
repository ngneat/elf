import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
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
    this.addImport(
      ['withActiveId', 'selectActiveEntity', 'setActiveId'],
      '@ngneat/elf-entities'
    );

    this.repo.insertMember(0, {
      name: `active${this.storeSingularNames.className}$`,
      kind: StructureKind.Property,
      initializer: `${this.storeVariableName}.pipe(selectActiveEntity())`,
    });

    this.repo.addMember({
      kind: StructureKind.Method,
      name: this.isFunctionsTpl
        ? `setActive${this.storeNames.className}Id`
        : `setActiveId`,
      parameters: [
        {
          name: 'id',
          type: `${this.storeSingularNames.className}['${this.idKey}']`,
        },
      ],
      statements: [`${this.storeVariableName}.update(setActiveId(id));`],
    });
  }
}
