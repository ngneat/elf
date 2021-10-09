import { ClassDeclaration, SourceFile, StructureKind } from 'ts-morph';
import { Features, Options } from '../types';
import { coerceArray, names, resolveStoreVariableName } from '../utils';

// @ts-ignore
import * as pluralize from 'pluralize';
import { CallExpression } from 'typescript';

export abstract class FeatureBuilder {
  static supports(featureName: Features): boolean {
    return false;
  }

  storeName = this.options.storeName;
  idKey = this.options.idKey;
  storeSingularNames = names(pluralize.singular(this.storeName));
  storeNames = names(this.storeName);
  storeVariableName = resolveStoreVariableName(
    this.options.template,
    this.storeNames
  );
  isFunctionsTpl =
    !this.options.template || this.options.template === 'functions';

  constructor(
    protected sourceFile: SourceFile,
    protected repo: ClassDeclaration,
    protected options: Options
  ) {}

  abstract run(): void;

  abstract getPropsFactory(): CallExpression;

  addImport(name: string | string[], moduleSpecifier = '@ngneat/elf') {
    const importDecl = this.sourceFile.getImportDeclaration(moduleSpecifier);

    if (!importDecl) {
      this.sourceFile.insertImportDeclaration(this.getLastImportIndex() + 1, {
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

  getLastImportIndex() {
    const imports = this.sourceFile.getImportDeclarations();

    return imports[imports.length - 1].getChildIndex();
  }
}
