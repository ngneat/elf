import { FeatureBuilder } from './feature-builder';
import { DEFAULT_ID_KEY, Features } from '../types';
import { StructureKind, ClassMemberStructures } from 'ts-morph';
import { factory } from 'typescript';

export class EntitiesBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withEntities';
  }

  getPropsFactory() {
    const type: any[] = [
      factory.createTypeReferenceNode(
        factory.createIdentifier(this.storeSingularNames.className),
        undefined
      ),
    ];

    const notDefaultId = this.idKey !== DEFAULT_ID_KEY;

    if (notDefaultId) {
      type.push(
        factory.createLiteralTypeNode(
          factory.createStringLiteral(this.idKey, true)
        )
      );
    }

    let props: any[] = [];

    if (notDefaultId) {
      props = [
        factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('idKey'),
              factory.createStringLiteral(this.idKey, true)
            ),
          ],
          false
        ),
      ];
    }

    return factory.createCallExpression(
      factory.createIdentifier('withEntities'),
      type,
      props
    );
  }

  run() {
    this.addImport(
      ['withEntities', 'selectAllEntities', ...this.options.crud],
      '@ngneat/elf-entities'
    );

    this.sourceFile.insertInterface(this.getLastImportIndex() + 1, {
      name: this.storeSingularNames.className,
      isExported: true,
      properties: [
        {
          name: this.idKey,
          type: 'number',
        },
      ],
    });

    const initializer = `${this.storeVariableName}.pipe(selectAllEntities())`;
    const memberData: ClassMemberStructures = {
      name: `${this.storeNames.propertyName}$`,
      kind: StructureKind.Property,
    };

    if (this.isStoreInlinedInClass) {
      this.addImport('Observable', 'rxjs');

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

    this.options.crud.forEach((op) => this[op]?.());
  }

  setEntities() {
    this.repo.addMember({
      kind: StructureKind.Method,
      name: `set${this.storeNames.className}`,
      parameters: [
        {
          name: this.storeNames.propertyName,
          type: `${this.storeSingularNames.className}[]`,
        },
      ],
      statements: [
        `${this.storeVariableName}.update(setEntities(${this.storeNames.propertyName}));`,
      ],
    });
  }

  addEntities() {
    this.repo.addMember({
      kind: StructureKind.Method,
      name: `add${this.storeSingularNames.className}`,
      parameters: [
        {
          name: this.storeSingularNames.propertyName,
          type: this.storeSingularNames.className,
        },
      ],
      statements: [
        `${this.storeVariableName}.update(addEntities(${this.storeSingularNames.propertyName}));`,
      ],
    });
  }

  updateEntities() {
    this.repo.addMember({
      kind: StructureKind.Method,
      name: `update${this.storeSingularNames.className}`,
      parameters: [
        {
          name: 'id',
          type: `${this.storeSingularNames.className}['${this.idKey}']`,
        },
        {
          name: this.storeSingularNames.propertyName,
          type: `Partial<${this.storeSingularNames.className}>`,
        },
      ],
      statements: [
        `${this.storeVariableName}.update(updateEntities(id, ${this.storeSingularNames.propertyName}));`,
      ],
    });
  }

  deleteEntities() {
    this.repo.addMember({
      kind: StructureKind.Method,
      name: `delete${this.storeSingularNames.className}`,
      parameters: [
        {
          name: 'id',
          type: `${this.storeSingularNames.className}['${this.idKey}']`,
        },
      ],
      statements: [`${this.storeVariableName}.update(deleteEntities(id));`],
    });
  }
}
