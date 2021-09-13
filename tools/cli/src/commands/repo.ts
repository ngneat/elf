import { Command, flags } from '@oclif/command';

import { prompt } from '../prompt';
import { createRepo } from '../builders/repo-builder';
import { writeFileSync } from 'fs-extra';
import { dash } from '../utils';
import chalk from 'chalk';

export default class Repo extends Command {
  static description = 'describe the command here';

  static examples = [];

  static flags = {
    'dry-run': flags.boolean({ default: false }),
    help: flags.help({ char: 'h' }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Repo);

    const options = await prompt();

    const path = `${options.path}/${dash(options.storeName)}.repository.ts`;
    const repo = createRepo(options);

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
  }
}
