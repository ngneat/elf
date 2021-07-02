import { Command, flags } from '@oclif/command';

import { prompt } from '../prompt';
import { createRepo } from '../repo-builder';
import { writeFileSync } from 'fs-extra';
import { dash } from '../utils';

export default class Repo extends Command {
  static description = 'describe the command here';

  static examples = [];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [];

  async run() {
    const { args, flags } = this.parse(Repo);

    const options = await prompt();
    writeFileSync(
      `${options.path}/${dash(options.storeName)}.repository.ts`,
      createRepo(options)
    );
  }
}
