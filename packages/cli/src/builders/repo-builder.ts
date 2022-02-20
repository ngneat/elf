import {
  ClassDeclaration,
  printNode,
  Project,
  QuoteKind,
  SourceFile,
  StructureKind,
  VariableDeclarationKind,
} from 'ts-morph';
import { CallExpression, factory, ScriptTarget } from 'typescript';
import { Options } from '../types';
import { names, resolveStoreVariableName } from '../utils';
import { ActiveIdBuilder } from './active-id.builder';
import { ActiveIdsBuilder } from './active-ids.builder';
import { EntitiesBuilder } from './entities.builder';
import { PropsBuilder } from './props.builder';
import { RequestsCacheBuilder } from './requests-cache.builder';
import { RequestsStatusBuilder } from './requests-status.builder';
import { UIEntitiesBuilder } from './ui-entities.builder';

export function createRepo(options: Options) {
  const { storeName } = options;
  const storeNames = names(storeName);
  const isFunctionTpl = !options.template || options.template === 'functions';

  const project = new Project({
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
    },
    compilerOptions: {
      target: ScriptTarget.ES2015,
    },
  });

  const sourceFile = project.createSourceFile(`repo.ts`, ``);

  const repoName = `${storeNames.className}Repository`;
  const repoClassDec = sourceFile.addClass({
    name: repoName,
    isExported: true,
  });

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@ngneat/elf',
    namedImports: ['createStore'].map((name) => ({
      kind: StructureKind.ImportSpecifier,
      name,
    })),
  });

  const builders = [
    RequestsCacheBuilder,
    RequestsStatusBuilder,
    ActiveIdBuilder,
    ActiveIdsBuilder,
    EntitiesBuilder,
    PropsBuilder,
    UIEntitiesBuilder,
  ];

  const propsFactories: CallExpression[] = [];

  for (const feature of options.features) {
    for (const Builder of builders) {
      if (Builder.supports(feature)) {
        const instance = new Builder(sourceFile, repoClassDec, options);
        instance.run();
        propsFactories.push(instance.getPropsFactory());
      }
    }
  }

  const storeOpts = factory.createIdentifier(
    `{ name: '${storeNames.propertyName}' }`
  );

  const store = factory.createCallExpression(
    factory.createIdentifier('createStore'),
    undefined,
    [storeOpts, ...propsFactories]
  );

  const repoPosition = repoClassDec.getChildIndex();

  sourceFile.insertVariableStatement(repoPosition, {
    declarationKind: VariableDeclarationKind.Const,
    isExported: isFunctionTpl,
    declarations: [
      {
        name: resolveStoreVariableName(options.template, storeNames),
        initializer: printNode(store),
      },
    ],
  });

  if (isFunctionTpl) {
    toFunctions(sourceFile, repoClassDec);
  }

  if (options.hooks) {
    options.hooks.forEach((h) => h.post?.({ sourceFile, repoName, options }));
  }

  sourceFile.formatText({ indentSize: 2 });

  return sourceFile.getText();
}

function toFunctions(sourceFile: SourceFile, classDec: ClassDeclaration) {
  const exported: string[] = [];

  classDec?.getProperties().forEach((p) => {
    exported.push(`export const ${p.getText()}`);
  });

  classDec?.getMethods().forEach((m) => {
    exported.push(`export function ${m.getText()}`);
  });

  classDec?.remove();

  sourceFile.replaceWithText(
    `${sourceFile.getText()}\n ${exported.join('\n\n')}`
  );
}
