import { FeatureBuilder } from './feature-builder';
import { Features } from '../types';
import { StructureKind } from 'ts-morph';
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
    this.addNamedImport(['withProps']);

    this.sourceFile.insertInterface(1, {
      name: `${capitalize(this.storeName)}Props`,
      isExported: true,
    });
  }
}
