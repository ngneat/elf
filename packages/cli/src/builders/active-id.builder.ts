import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind, ClassMemberStructures } from 'ts-morph';
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

    const initializer = `${this.storeVariableName}.pipe(selectActiveEntity())`;
    const memberData: ClassMemberStructures = {
      name: `active${this.storeSingularNames.className}$`,
      kind: StructureKind.Property,
    };

    if (this.isStoreInlinedInClass) {
      this.repo.insertProperty(0, {
        ...memberData,
        type: `Observable<${this.storeSingularNames.className} | undefined>`,
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
