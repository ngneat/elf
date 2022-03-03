import { Command, flags } from '@oclif/command';
import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import { outputFileSync } from 'fs-extra';
import { resolve } from 'path';
import { register } from 'ts-node';
import { createRepo } from '../builders/repo-builder';
import { prompt } from '../prompt';
import { DEFAULT_ID_KEY, GlobalConfig } from '../types';
import { names } from '../utils';

export default class Repo extends Command {
  static description = 'Create a repository';

  static examples = [];

  static flags = {
    'dry-run': flags.boolean({ default: false }),
    help: flags.help({ char: 'h' }),
  };

  static args = [];

  async run() {
    const { flags } = this.parse(Repo);

    const globalConfig: GlobalConfig | undefined =
      cosmiconfigSync('elf').search()?.config;

    const options = await prompt(globalConfig);
    let mergedOptions = options;

    if (globalConfig?.cli?.plugins) {
      register({
        transpileOnly: true,
        compilerOptions: {
          module: 'commonjs',
          target: 'es5',
        },
      });

      mergedOptions.hooks = globalConfig.cli.plugins.map((path) => {
        const lib = require(require.resolve(path, { paths: [process.cwd()] }));
        return lib.default || lib;
      });
    }

    const path = resolve(
      options.path,
      globalConfig?.cli?.repoLibrary ?? '',
      `${names(options.storeName).fileName}.repository.ts`
    );

    if (globalConfig) {
      mergedOptions = {
        ...options,
        template: globalConfig.cli?.repoTemplate ?? 'functions',
        idKey: globalConfig.cli?.idKey ?? DEFAULT_ID_KEY,
        inlineStoreInClass:
          options.inlineStoreInClass ??
          globalConfig.cli?.inlineStoreInClass ??
          false,
      };
    }

    const repo = createRepo(mergedOptions);

    if (flags['dry-run']) {
      console.log('\n');

      console.log(chalk.greenBright(`CREATE`), `${path}\n`);

      console.log(repo);

      console.log(
        chalk.yellow('NOTE: The "dryRun" flag means no changes were made.')
      );

      console.log('\n');
      return;
    }

    outputFileSync(path, repo);
    console.log('\n', chalk.greenBright(`CREATED`), `${path}\n`);
  }
}
