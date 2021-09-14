import { Command, flags } from '@oclif/command';

import { prompt } from '../prompt';
import { createRepo } from '../builders/repo-builder';
import { writeFileSync } from 'fs-extra';
import { dash } from '../utils';
import chalk from 'chalk';
import { cosmiconfigSync } from 'cosmiconfig';
import { DEFAULT_ID_KEY, GlobalConfig } from '../types';

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
    let mergedOptions = options;

    const path = `${options.path}/${dash(options.storeName)}.repository.ts`;

    const globalConfig: GlobalConfig | undefined =
      cosmiconfigSync('elf').search()?.config;

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

    writeFileSync(path, repo);
    console.log('\n', chalk.greenBright(`CREATED`), `${path}\n`);
  }
}
