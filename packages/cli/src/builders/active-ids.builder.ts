import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
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
    this.addImport(
      ['withActiveIds', 'selectActiveEntities', 'toggleActiveIds'],
      '@ngneat/elf-entities'
    );

    this.repo.insertMember(0, {
      name: `active${this.storeNames.className}$`,
      kind: StructureKind.Property,
      initializer: `${this.storeVariableName}.pipe(selectActiveEntities())`,
    });

    this.repo.addMember({
      kind: StructureKind.Method,
      name: `toggleActiveIds`,
      parameters: [
        {
          name: 'ids',
          type: `Array<${this.storeSingularNames.className}['${this.idKey}']>`,
        },
      ],
      statements: [`${this.storeVariableName}.update(toggleActiveIds(ids));`],
    });
  }
}
