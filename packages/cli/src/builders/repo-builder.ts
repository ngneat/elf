import {
  ClassDeclaration,
  printNode,
  Project,
  QuoteKind,
  SourceFile,
  StructureKind,
  VariableDeclarationKind,
  Scope,
  SyntaxKind,
  ConstructorDeclaration,
} from 'ts-morph';
import { CallExpression, factory, ScriptTarget } from 'typescript';
import { RequestsCacheBuilder } from './requests-cache.builder';
import { ActiveIdsBuilder } from './active-ids.builder';
import { EntitiesBuilder } from './entities.builder';
import { UIEntitiesBuilder } from './ui-entities.builder';
import { RequestsStatusBuilder } from './requests-status.builder';
import { ActiveIdBuilder } from './active-id.builder';
import { PropsBuilder } from './props.builder';
import { Options } from '../types';
import { names, resolveStoreVariableName } from '../utils';

export function createRepo(options: Options) {
  const { storeName } = options;
  const storeNames = names(storeName);
  const isFunctionTpl = !options.template || options.template === 'functions';
  const isStoreInlinedInClass = !isFunctionTpl && options.inlineStoreInClass;

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
  let repoClassDecConstructor: ConstructorDeclaration | undefined;

  if (isStoreInlinedInClass) {
    repoClassDec.addConstructor();
    repoClassDecConstructor = repoClassDec.getConstructors()[0];
  }

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@ngneat/elf',
    namedImports: ['Store', 'createState'].map((name) => ({
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

  const state = factory.createCallExpression(
    factory.createIdentifier('createState'),
    undefined,
    propsFactories
  );

  if (isStoreInlinedInClass && repoClassDecConstructor) {
    addInlineStoreToRepoClass({
      repoClassDec,
      repoClassDecConstructor,
      options,
      state,
      storeNames,
    });
  } else {
    addStoreToRepo({
      repoClassDec,
      options,
      state,
      storeNames,
      isFunctionTpl,
      sourceFile,
    });

    if (isFunctionTpl) {
      toFunctions(sourceFile, repoClassDec);
    }
  }

  if (options.hooks) {
    options.hooks.forEach((h) => h.post?.({ sourceFile, repoName, options }));
  }

  sourceFile.formatText({ indentSize: 2 });

  return sourceFile.getText();
}

function addStoreToRepo({
  repoClassDec: classDec,
  sourceFile,
  options,
  storeNames,
  state,
  isFunctionTpl,
}: {
  repoClassDec: ClassDeclaration;
  sourceFile: SourceFile;
  options: Options;
  storeNames: ReturnType<typeof names>;
  state: CallExpression;
  isFunctionTpl: boolean;
}) {
  const repoPosition = classDec.getChildIndex();

  sourceFile.insertVariableStatement(repoPosition, {
    declarationKind: VariableDeclarationKind.Const,
    isExported: isFunctionTpl,
    declarations: [
      {
        name: resolveStoreVariableName(options.template, storeNames),
        initializer: `new Store({ name: '${storeNames.propertyName}', state, config })`,
      },
    ],
  });

  sourceFile.insertVariableStatement(repoPosition, {
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: '{ state, config }',
        initializer: printNode(state),
      },
    ],
  });
}

function addInlineStoreToRepoClass({
  repoClassDec: classDec,
  repoClassDecConstructor: constructorDec,
  options,
  storeNames,
  state,
}: {
  repoClassDec: ClassDeclaration;
  repoClassDecConstructor: ConstructorDeclaration;
  options: Options;
  storeNames: ReturnType<typeof names>;
  state: CallExpression;
}) {
  const storeName = resolveStoreVariableName(
    options.template,
    storeNames,
    true
  );
  const { propertyIndex, methodIndex } = getPositionsOfInlineStoreDeclarations(
    classDec,
    constructorDec
  );
  const createStoreMethodName = 'createStore';

  classDec.insertMethod(methodIndex, {
    name: createStoreMethodName,
    returnType: `Store<{ name: string; state: typeof state; config: typeof config; }>`,
    scope: Scope.Private,
    statements: (writer) => {
      writer.writeLine(`const { state, config } = ${printNode(state)};`);
      writer.blankLine();
      writer.writeLine(
        `return new Store({ name: '${storeNames.propertyName}', state, config });`
      );
    },
  });

  constructorDec.insertStatements(
    0,
    `${storeName} = this.${createStoreMethodName}();`
  );

  const store = classDec.insertProperty(propertyIndex, {
    name: `${resolveStoreVariableName(options.template, storeNames)}`,
    scope: Scope.Private,
  });

  if (propertyIndex > 0) {
    store?.prependWhitespace('\n');
  }
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

function getPositionsOfInlineStoreDeclarations(
  classDec: ClassDeclaration,
  constructorDec: ConstructorDeclaration
) {
  const lastPropertyIndex = classDec
    .getLastChildByKind(SyntaxKind.PropertyDeclaration)
    ?.getChildIndex();
  const lastMethodIndex = classDec
    .getLastChildByKind(SyntaxKind.MethodDeclaration)
    ?.getChildIndex();

  return {
    methodIndex: (lastMethodIndex ?? constructorDec.getChildIndex()) + 1,
    propertyIndex: lastPropertyIndex
      ? lastPropertyIndex + 1
      : constructorDec.getChildIndex(),
  };
}
