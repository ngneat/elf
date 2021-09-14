import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { capitalize } from '../utils';
import { factory } from 'typescript';

export class PropsBuilder extends FeatureBuilder {
  static supports(featureName: Features): boolean {
    return featureName === 'withProps';
  }

  getPropsFactory() {
    return factory.createCallExpression(
      factory.createIdentifier('withProps'),
      [
        factory.createTypeReferenceNode(
          factory.createIdentifier(`${capitalize(this.storeName)}Props`),
          undefined
        ),
      ],
      [factory.createObjectLiteralExpression([], false)]
    );
  }

  run() {
    this.addImport(['withProps']);

    const decl = this.sourceFile.insertInterface(
      this.getLastImportIndex() + 1,
      {
        name: `${capitalize(this.storeName)}Props`,
        isExported: true,
      }
    );

    decl.replaceWithText(
      `// eslint-disable-next-line @typescript-eslint/no-empty-interface\n${decl.getText()}`
    );
  }
}
