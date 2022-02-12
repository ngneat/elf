import { Command, flags } from '@oclif/command';
import * as inquirer from 'inquirer';

export default class Install extends Command {
  static description = 'Install Elf packages';

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  async run() {
    this.parse(Install);

    const { detect } = require('detect-package-manager');

    const pm = await detect();

    const { packages, external } = await prompt();
    const all = [...packages, ...external];

    if (all.length) {
      const shell = `${pm} ${pm === 'npm' ? 'install' : 'add'} ${all.join(
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
  { name: '@ngneat/elf', link: 'https://ngneat.github.io/elf/docs/store' },
  {
    name: '@ngneat/elf-entities',
    link: 'https://ngneat.github.io/elf/docs/features/entities/entities/',
  },
  {
    name: '@ngneat/elf-devtools',
    link: 'https://ngneat.github.io/elf/docs/dev-tools',
  },
  {
    name: '@ngneat/elf-requests',
    link: 'https://ngneat.github.io/elf/docs/features/requests/requests-status',
  },
  {
    name: '@ngneat/elf-state-history',
    link: 'https://ngneat.github.io/elf/docs/features/history',
  },
  {
    name: '@ngneat/elf-persist-state',
    link: 'https://ngneat.github.io/elf/docs/features/persist-state',
  },
  {
    name: '@ngneat/elf-pagination',
    link: 'https://ngneat.github.io/elf/docs/features/pagination',
  },
  { name: '@ngneat/elf-cli-ng', link: 'https://ngneat.github.io/elf/docs/cli' },
];

const external = [
  { name: '@ngneat/effects', link: 'https://github.com/ngneat/effects' },
  {
    name: '@ngneat/effects-hooks',
    link: 'https://github.com/ngneat/effects#use-with-react',
  },
  {
    name: '@ngneat/effects-ng',
    link: 'https://github.com/ngneat/effects#use-with-angular',
  },
  { name: '@ngneat/react-rxjs', link: 'https://github.com/ngneat/react-rxjs' },
];

export async function prompt() {
  return inquirer.prompt<{ packages: string[]; external: string[] }>([
    {
      name: 'packages',
      message: 'Select packages',
      type: 'checkbox',
      choices: packages.map(({ link, name }) => ({
        name: `${name} (${link})`,
        value: name,
      })),
    },
    {
      name: 'external',
      message: 'Select external packages',
      type: 'checkbox',
      choices: external.map(({ name, link }) => ({
        name: `${name} (${link})`,
        value: name,
      })),
    },
  ]);
}
