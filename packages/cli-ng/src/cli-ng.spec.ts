import { createRepo } from '@ngneat/elf-cli';
import ngHook from './index';

describe('cli-ng', () => {
  it('should add the Injectable decorator', () => {
    const output = createRepo({
      idKey: 'id',
      features: ['withProps'],
      crud: [],
      template: 'class',
      storeName: 'todos',
      hooks: [ngHook],
      path: '',
    });

    expect(output).toMatchSnapshot();
  });
});
