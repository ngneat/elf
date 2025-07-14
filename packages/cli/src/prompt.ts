import { cosmiconfigSync } from 'cosmiconfig';
import inquirer from 'inquirer';
import {
  baseClassStorePlaces,
  baseFeatures,
  DEFAULT_ID_KEY,
  GlobalConfig,
  Options,
} from './types';
import { has } from './utils';

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

const basePath = process.cwd();

export async function prompt(options: GlobalConfig | undefined) {
  return inquirer.prompt<Options>([
    {
      name: 'storeName',
      message: 'Store name',
      validate(input: string) {
        if (!input) {
          return 'This field is required';
        }

        return true;
      },
      type: 'inputs',
    },
    {
      name: 'inlineStoreInClass',
      message: 'Place of the store in a class',
      type: 'list',
      choices: baseClassStorePlaces,
      when(): boolean {
        const globalConfig: GlobalConfig | undefined =
          cosmiconfigSync('elf').search()?.config;

        return (
          globalConfig?.cli?.repoTemplate === 'class' &&
          globalConfig?.cli?.inlineStoreInClass === undefined
        );
      },
    },
    {
      name: 'features',
      message: 'Select features',
      type: 'checkbox',
      choices: baseFeatures,
      validate(input: string[]) {
        if (input.includes('withActiveId') || input.includes('withActiveIds')) {
          if (!input.includes('withEntities')) {
            return 'You must use Entities with Active';
          }
        }

        return true;
      },
    },
    {
      name: 'crud',
      when(answers: Options) {
        return has(answers, 'withEntities');
      },
      message: 'Select CRUD operations',
      type: 'checkbox',
      choices: [
        { name: 'Set', value: 'setEntities' },
        { name: 'Create', value: 'addEntities' },
        {
          name: 'Update',
          value: 'updateEntities',
        },
        { name: 'Delete', value: 'deleteEntities' },
      ],
    },
    {
      name: 'idKey',
      default: DEFAULT_ID_KEY,
      type: 'input',
      when(answers: Options) {
        return has(answers, 'withEntities');
      },
    },
    {
      type: 'fuzzypath',
      name: 'path',
      itemType: 'directory',
      message: 'Where you like to put this repository?',
      rootPath: process.cwd(),
      excludeFilter: (nodePath: string) => {
        return nodePath.replace(basePath, '').startsWith('/.');
      },
      excludePath: (nodePath: string) => nodePath.includes('node_modules'),
      ...(options?.cli?.fuzzypath || {}),
    },
  ] as any);
}
