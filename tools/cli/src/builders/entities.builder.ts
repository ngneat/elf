import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
import { camelize, capitalize } from '../utils';
import { factory } from 'typescript';

export class EntitiesBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withEntities';
  }

  getPropsFactory() {
    const type: any[] = [
      factory.createTypeReferenceNode(
        factory.createIdentifier(capitalize(this.singularName)),
        undefined
      ),
    ];

    if (this.idKey !== 'id') {
      type.push(
        factory.createLiteralTypeNode(factory.createStringLiteral('_id', true))
      );
    }

    let props: any[] = [];

    if (this.idKey !== 'id') {
      props = [
        factory.createObjectLiteralExpression(
          [
            factory.createPropertyAssignment(
              factory.createIdentifier('idKey'),
              factory.createStringLiteral('_id', true)
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
    this.addNamedImport(['withEntities', 'selectAll', ...this.options.crud]);

    this.sourceFile.insertInterface(1, {
      name: capitalize(this.singularName),
      isExported: true,
      properties: [
        {
          name: this.idKey,
          type: 'number',
        },
      ],
    });

    this.repo.addMember({
      name: `${camelize(this.storeName)}$`,
      kind: StructureKind.Property,
      initializer: `store.pipe(selectAll())`,
    });

    this.options.crud.forEach((op) => this[op]?.());
  }

  addEntities() {
    this.repo.addMember({
      kind: StructureKind.Method,
      name: `add${capitalize(this.singularName)}`,
      parameters: [
        {
          name: camelize(this.singularName),
          type: capitalize(this.singularName),
        },
      ],
      statements: [
        `store.reduce(addEntities(${camelize(this.singularName)}));`,
      ],
    });
  }

  updateEntities() {
    this.repo.addMember({
      kind: StructureKind.Method,
      name: `update${capitalize(this.singularName)}`,
      parameters: [
        {
          name: 'id',
          type: `${capitalize(this.singularName)}['${this.idKey}']`,
        },
        {
          name: camelize(this.singularName),
          type: `Partial<${capitalize(this.singularName)}>`,
        },
      ],
      statements: [
        `store.reduce(updateEntities(id, ${camelize(this.singularName)}));`,
      ],
    });
  }

  removeEntities() {
    this.repo.addMember({
      kind: StructureKind.Method,
      name: `delete${capitalize(this.singularName)}`,
      parameters: [
        {
          name: 'id',
          type: `${capitalize(this.singularName)}['${this.idKey}']`,
        },
      ],
      statements: [`store.reduce(removeEntities(id));`],
    });
  }
}
