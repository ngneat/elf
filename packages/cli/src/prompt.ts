import * as inquirer from 'inquirer';
import {
  baseFeatures,
  DEFAULT_ID_KEY,
  GlobalConfig,
  Options,
  baseClassStorePlaces,
} from './types';
import { has } from './utils';
import { cosmiconfigSync } from 'cosmiconfig';

inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

export async function prompt(options: GlobalConfig | undefined) {
  return inquirer.prompt<Options>([
    {
      name: 'storeName',
      message: 'Store name',
      validate(input) {
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
      validate(input) {
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
      excludeFilter: (nodePath: string) => nodePath.includes('.'),
      excludePath: (nodePath: string) => nodePath.includes('node_modules'),
      ...(options?.cli?.fuzzypath || {}),
    },
  ]);
}
