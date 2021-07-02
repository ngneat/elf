import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { capitalize } from '../utils';
import { factory } from 'typescript';

export class UIEntitiesBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withUIEntities';
  }

  getPropsFactory() {
    const type: any[] = [
      factory.createTypeReferenceNode(
        factory.createIdentifier(`${capitalize(this.singularName)}UI`),
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
      factory.createIdentifier('withUIEntities'),
      type,
      props
    );
  }

  run() {
    this.addNamedImport(['withUIEntities']);

    this.sourceFile.insertInterface(1, {
      name: `${capitalize(this.singularName)}UI`,
      isExported: true,
      properties: [
        {
          name: this.idKey,
          type: 'number',
        },
      ],
    });
  }
}
