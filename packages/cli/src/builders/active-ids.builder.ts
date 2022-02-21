import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind, ClassMemberStructures } from 'ts-morph';
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

    const initializer = `${this.storeVariableName}.pipe(selectActiveEntities())`;
    const memberData: ClassMemberStructures = {
      name: `active${this.storeNames.className}$`,
      kind: StructureKind.Property,
    };

    if (this.isStoreInlinedInClass) {
      this.repo.insertProperty(0, {
        ...memberData,
        type: `Observable<${this.storeSingularNames.className}[]>`,
      });

      this.repoConstructor?.addStatements(
        `this.${memberData.name} = ${initializer};`
      );
    } else {
      this.repo.insertMember(0, {
        ...memberData,
        initializer,
      });
    }

    this.repo.addMember({
      kind: StructureKind.Method,
      name: this.isFunctionsTpl
        ? `toggleActive${this.storeNames.className}Ids`
        : `toggleActiveIds`,
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
