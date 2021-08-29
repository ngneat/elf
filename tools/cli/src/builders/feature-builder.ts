import { ClassDeclaration, SourceFile, StructureKind } from 'ts-morph';
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

  addImport(name: string | string[], moduleSpecifier = '@ngneat/elf') {
    const importDecl = this.sourceFile.getImportDeclaration(moduleSpecifier);

    if (!importDecl) {
      this.sourceFile.addImportDeclaration({
        moduleSpecifier,
        namedImports: coerceArray(name).map((name) => ({
          kind: StructureKind.ImportSpecifier,
          name,
        })),
      });
    } else {
      coerceArray(name).forEach((v) => importDecl.addNamedImport(v));
    }
  }
}
