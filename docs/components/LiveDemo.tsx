import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';
import { useColorMode } from '@docusaurus/theme-common';

const allPackages = {
  core: { '@ngneat/elf': 'latest' },
  entities: { '@ngneat/elf-entities': 'latest' },
  requests: { '@ngneat/elf-requests': 'latest' },
  pagination: { '@ngneat/elf-pagination': 'latest' },
  devtools: { '@ngneat/elf-devtools': 'latest' },
  persist: { '@ngneat/elf-persist-state': 'latest' },
  history: { '@ngneat/elf-state-history': 'latest' },
  rxjs: { rxjs: 'latest' },
  immer: { immer: 'latest' },
};

interface Props {
  src: string;
  packages: Array<Exclude<keyof typeof allPackages, 'core' | 'devtools'>>;
}

export function LiveDemo({ src, packages = [] }: Props) {
  const previewEl = useRef<HTMLDivElement>();
  const editor = useRef<any>();

  const include = ['core', 'rxjs', ...packages];

  const { colorMode } = useColorMode();

  useEffect(() => {
    const deps = include.reduce((acc, p) => {
      Object.assign(acc, allPackages[p]);

      return acc;
    }, {});

    sdk
      .embedProject(
        previewEl.current,
        {
          description: 'this is descrption',
          title: 'Elf Core',
          files: {
            'index.html': '',
            'index.ts': src,
          },
          template: 'typescript',
          dependencies: deps,
          settings: {
            compile: {
              clearConsole: true,
            },
          },
        },
        {
          hideDevTools: false,
          devToolsHeight: 99,
          theme: colorMode,
          height: '500px',
        }
      )
      .then((vm) => {
        editor.current = vm.editor;
      });
  }, []);

  useEffect(() => {
    if (editor.current) {
      editor.current.setTheme(colorMode);
    }
  }, [colorMode]);

  return (
    <section style={{ height: '500px' }}>
      <div ref={previewEl}></div>
    </section>
  );
}
