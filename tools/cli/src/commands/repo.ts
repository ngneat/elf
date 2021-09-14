import { Command, flags } from '@oclif/command';

import { prompt } from '../prompt';
import { createRepo } from '../builders/repo-builder';
import { outputFileSync } from 'fs-extra';
import { dash } from '../utils';
import { cosmiconfigSync } from 'cosmiconfig';
import { DEFAULT_ID_KEY, GlobalConfig } from '../types';
import { resolve } from 'path';
import chalk from 'chalk';
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

    const options = await prompt();

    const globalConfig: GlobalConfig | undefined =
      cosmiconfigSync('elf').search()?.config;

    let mergedOptions = options;
    const path = resolve(
      options.path,
      globalConfig?.cli?.repoLibrary ?? '',
      `${dash(options.storeName)}.repository.ts`
    );

    if (globalConfig) {
      mergedOptions = {
        ...options,
        template: globalConfig.cli?.repoTemplate ?? 'class',
        idKey: globalConfig.cli?.idKey ?? DEFAULT_ID_KEY,
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
