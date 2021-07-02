import { ClassDeclaration, SourceFile, ImportDeclaration } from 'ts-morph';
import { Features, Options } from '../types';
import { coerceArray } from '../utils';
// @ts-ignore
import * as pluralize from 'pluralize';
import { CallExpression } from 'typescript';

export abstract class FeatureBuilder {
  static supports(featureName: Features): boolean {
    return false;
  }

  constructor(
    protected sourceFile: SourceFile,
    protected repo: ClassDeclaration,
    protected importDecl: ImportDeclaration,
    protected options: Options
  ) {}

  abstract run(): void;

  abstract getPropsFactory(): CallExpression;

  get storeName() {
    return this.options.storeName;
  }

  get singularName() {
    return pluralize.singular(this.storeName);
  }

  get idKey() {
    return this.options.idKey;
  }

  addNamedImport(name: string | string[]) {
    coerceArray(name).forEach((v) => this.importDecl!.addNamedImport(v));
  }
}
