import { FeatureBuilder } from './feature-builder';
import { DEFAULT_ID_KEY, Features } from '../types';
import { factory } from 'typescript';

export class UIEntitiesBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withUIEntities';
  }

  getPropsFactory() {
    const type: any[] = [
      factory.createTypeReferenceNode(
        factory.createIdentifier(`${this.storeSingularNames.className}UI`),
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
      factory.createIdentifier('withUIEntities'),
      type,
      props
    );
  }

  run() {
    this.addImport(['withUIEntities'], '@ngneat/elf-entities');

    this.sourceFile.insertInterface(this.getLastImportIndex() + 1, {
      name: `${this.storeSingularNames.className}UI`,
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
