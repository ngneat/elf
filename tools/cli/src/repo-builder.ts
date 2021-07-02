import {
  ClassDeclaration,
  printNode,
  Project,
  QuoteKind,
  SourceFile,
  StructureKind,
  VariableDeclarationKind,
} from 'ts-morph';
import {CallExpression, factory, ScriptTarget} from 'typescript';
import {camelize, capitalize, has} from './utils';
import {Options} from './types';
// @ts-ignore
import * as pluralize from 'pluralize';

export function createRepo(options: Options) {
  const {storeName} = options;

  const project = new Project({
    manipulationSettings: {
      quoteKind: QuoteKind.Single,
    },
    compilerOptions: {
      target: ScriptTarget.ES2015,
    },
  });

  const sourceFile = project.createSourceFile(`repo.ts`, ``);

  sourceFile.addImportDeclaration({
    moduleSpecifier: '@ngneat/elf',
    namedImports: resolveImports(options).map((name) => ({
      kind: StructureKind.ImportSpecifier,
      name,
    })),
  });

  resolveInterfaces(sourceFile, options);

  const state = factory.createCallExpression(
    factory.createIdentifier('createState'),
    undefined,
    resolveFeatures(options)
  );

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: '{ state, config }',
        initializer: printNode(state),
      },
    ],
  });

  sourceFile.addVariableStatement({
    declarationKind: VariableDeclarationKind.Const,
    declarations: [
      {
        name: 'store',
        initializer: `new Store({ name: '${camelize(
          storeName
        )}', state, config })`,
      },
    ],
  });

  const repo = sourceFile.addClass({
    name: `${capitalize(storeName)}Repository`,
    isExported: true,
  });

  extendRepo(repo, options);

  sourceFile.formatText({indentSize: 2});

  return sourceFile.getText();
}


function extendRepo(repo: ClassDeclaration, options: Options) {
  if (has(options, 'withEntities')) {
    repo.addMember({
      name: `${camelize(options.storeName)}$`,
      kind: StructureKind.Property,
      initializer: `store.pipe(selectAll())`,
    });

    options.crud.forEach((type) => {
      crudOps[type](repo, options);
    });
  }

  if (has(options, 'withActiveId')) {
    extendActiveId(repo, options);
  }

  if (has(options, 'withActiveIds')) {
    extendActiveIds(repo, options);
  }
}


const crudOps: {
  [key in Options['crud'][0]]: (
    repo: ClassDeclaration,
    options: Options
  ) => void;
} = {
  addEntities(repo, options) {
    const singularName = pluralize.singular(options.storeName);

    repo.addMember({
      kind: StructureKind.Method,
      name: `add${capitalize(singularName)}`,
      parameters: [
        {
          name: camelize(singularName),
          type: capitalize(singularName),
        },
      ],
      statements: [`store.reduce(addEntities(${camelize(singularName)}));`],
    });
  },
  updateEntities(repo, options) {
    const singularName = pluralize.singular(options.storeName);

    repo.addMember({
      kind: StructureKind.Method,
      name: `update${capitalize(singularName)}`,
      parameters: [
        {
          name: 'id',
          type: `${capitalize(singularName)}['${options.idKey}']`,
        },
        {
          name: camelize(singularName),
          type: `Partial<${capitalize(singularName)}>`,
        },
      ],
      statements: [
        `store.reduce(updateEntities(id, ${camelize(singularName)}));`,
      ],
    });
  },
  removeEntities(repo, options) {
    const singularName = pluralize.singular(options.storeName);

    repo.addMember({
      kind: StructureKind.Method,
      name: `delete${capitalize(singularName)}`,
      parameters: [
        {
          name: 'id',
          type: `${capitalize(singularName)}['${options.idKey}']`,
        },
      ],
      statements: [`store.reduce(removeEntities(id));`],
    });
  },
};

function extendActiveId(repo: ClassDeclaration, options: Options) {
  const singularName = pluralize.singular(options.storeName);

  repo.addMember({
    kind: StructureKind.Method,
    name: `setActiveId`,
    parameters: [
      {
        name: 'id',
        type: `${capitalize(singularName)}['${options.idKey}']`,
      },
    ],
    statements: [`store.reduce(setActiveId(id));`],
  });

  repo.insertMember(0, {
    name: `active${capitalize(camelize(singularName))}$`,
    kind: StructureKind.Property,
    initializer: `store.pipe(selectActiveEntity())`,
  });
}

function extendActiveIds(repo: ClassDeclaration, options: Options) {
  const singularName = pluralize.singular(options.storeName);

  repo.addMember({
    kind: StructureKind.Method,
    name: `toggleActiveIds`,
    parameters: [
      {
        name: 'ids',
        type: `Array<${capitalize(singularName)}['${options.idKey}']>`,
      },
    ],
    statements: [`store.reduce(setActiveIds(ids));`],
  });

  repo.insertMember(0, {
    name: `active${capitalize(camelize(options.storeName))}$`,
    kind: StructureKind.Property,
    initializer: `store.pipe(selectActiveEntities())`,
  });
}

function resolveImports(options: Options) {
  const base = [
    'Store',
    'createState',
    ...options.features,
    ...(options.crud || []),
  ];

  if (has(options, 'withEntities')) {
    base.push('selectAll');
  }

  if (has(options, 'withActiveId')) {
    base.push('setActiveId', 'selectActiveEntity');
  }

  if (has(options, 'withActiveIds')) {
    base.push('toggleActiveIds', 'selectActiveEntities');
  }

  return base;
}

const features: {
  [key in Options['features'][0]]: (options: Options) => CallExpression;
} = {
  withProps(options) {
    return factory.createCallExpression(
      factory.createIdentifier('withProps'),
      [
        factory.createTypeReferenceNode(
          factory.createIdentifier(`${capitalize(options.storeName)}Props`),
          undefined
        ),
      ],
      [factory.createObjectLiteralExpression([], false)]
    );
  },
  withEntities(options) {
    const type: any[] = [
      factory.createTypeReferenceNode(
        factory.createIdentifier(capitalize(pluralize.singular(options.storeName))),
        undefined
      ),
    ]

    if (options.idKey !== 'id') {
      type.push(factory.createLiteralTypeNode(factory.createStringLiteral("_id", true)))
    }

    let props: any[] = [];

    if (options.idKey !== 'id') {
      props = [factory.createObjectLiteralExpression(
        [factory.createPropertyAssignment(
          factory.createIdentifier("idKey"),
          factory.createStringLiteral("_id", true)
        )],
        false
      )]
    }

    return factory.createCallExpression(
      factory.createIdentifier("withEntities"),
      type,
      props
    )
  },
  withUIEntities(options) {
    const type: any[] = [
      factory.createTypeReferenceNode(
        factory.createIdentifier(`${capitalize(pluralize.singular(options.storeName))}UI`),
        undefined
      ),
    ]

    if (options.idKey !== 'id') {
      type.push(factory.createLiteralTypeNode(factory.createStringLiteral("_id", true)))
    }

    let props: any[] = [];

    if (options.idKey !== 'id') {
      props = [factory.createObjectLiteralExpression(
        [factory.createPropertyAssignment(
          factory.createIdentifier("idKey"),
          factory.createStringLiteral("_id", true)
        )],
        false
      )]
    }

    return factory.createCallExpression(
      factory.createIdentifier("withUIEntities"),
      type,
      props
    )
  },
  withStatus() {
    return factory.createCallExpression(
      factory.createIdentifier('withStatus'),
      undefined,
      []
    );
  },
  withCache() {
    return factory.createCallExpression(
      factory.createIdentifier('withCache'),
      undefined,
      []
    );
  },
  withActiveId() {
    return factory.createCallExpression(
      factory.createIdentifier('withActiveId'),
      undefined,
      []
    );
  },
  withActiveIds() {
    return factory.createCallExpression(
      factory.createIdentifier('withActiveIds'),
      undefined,
      []
    );
  },
};

function resolveFeatures(options: Options) {
  return options.features.map((f) => features[f](options));
}

function resolveInterfaces(sourceFile: SourceFile, options: Options) {
  const storeName = options.storeName;

  if (has(options, 'withProps')) {
    sourceFile.addInterface({
      name: `${capitalize(storeName)}Props`,
      isExported: true,
    });
  }

  if (has(options, 'withEntities')) {
    sourceFile.addInterface({
      name: capitalize(pluralize.singular(storeName)),
      isExported: true,
      properties: [
        {
          name: options.idKey,
          type: 'number',
        },
      ],
    });
  }

  if (has(options, 'withUIEntities')) {
    sourceFile.addInterface({
      name: `${capitalize(pluralize.singular(storeName))}UI`,
      isExported: true,
      properties: [
        {
          name: options.idKey,
          type: 'number',
        },
      ],
    });
  }
}
