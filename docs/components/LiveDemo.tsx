import React, { useEffect, useRef } from 'react';
import sdk from '@stackblitz/sdk';
import useThemeContext from '@theme/hooks/useThemeContext';

export function LiveDemo({ src }) {
  const ref = useRef<HTMLDivElement>();

  const { isDarkTheme } = useThemeContext();

  useEffect(() => {
    sdk.embedProject(
      ref.current,
      {
        description: 'this is descrption',
        title: 'Elf Core',
        files: {
          'index.html': '',
          'index.ts': src,
        },
        template: 'typescript',
        dependencies: {
          lodash: 'latest',
        },
        settings: {
          compile: {
            clearConsole: true,
          },
        },
      },
      {
        hideDevTools: false,
        devToolsHeight: 1000,
        theme: isDarkTheme ? 'dark' : 'light',
        height: '500px',
      }
    );
  }, []);

  return (
    <section>
      <div ref={ref}></div>
    </section>
  );
}
