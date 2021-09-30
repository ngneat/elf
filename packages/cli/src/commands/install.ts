import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';

export default class Install extends Command {
  static description = 'Install Elf packages';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Install);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const detectPackageManager = require('detect-package-manager');

    const pm = await detectPackageManager();

    const { packages } = await prompt();

    if (packages.length) {
      const shell = `${pm} ${pm === 'npm' ? 'install' : 'add'} ${packages.join(
        ' '
      )}`;

      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('child_process').execSync(shell, {
        stdio: 'inherit',
      });
    }
  }
}

const packages = [
  '@ngneat/elf',
  '@ngneat/elf-entities',
  '@ngneat/elf-devtools',
  '@ngneat/elf-requests',
  '@ngneat/elf-state-history',
  '@ngneat/elf-persist-state',
  '@ngneat/elf-pagination',
  '@ngneat/elf-cli-ng',
];

export async function prompt() {
  return inquirer.prompt<{ packages: string[] }>([
    {
      name: 'packages',
      message: 'Select packages',
      type: 'checkbox',
      choices: packages.map((p) => ({
        name: p,
        value: p,
      })),
    },
  ]);
}
