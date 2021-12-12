import { Hooks } from '@ngneat/elf-cli';

const hooks: Hooks = {
  post({ sourceFile, repoName }) {
    sourceFile.getClass(repoName)?.addDecorator({
      name: `Injectable`,
      arguments: [`{ providedIn: 'root' }`],
    });

    sourceFile.addImportDeclaration({
      namedImports: [{ name: 'Injectable' }],
      moduleSpecifier: '@angular/core',
    });
  },
};

export default hooks;
