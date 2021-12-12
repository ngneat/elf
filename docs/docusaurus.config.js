const lightCodeTheme = require('prism-react-renderer/themes/nightOwlLight');
const darkCodeTheme = require('prism-react-renderer/themes/oceanicNext');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Elf | A Reactive Store with Magical Powers',
  tagline: 'A Reactive Store with Magical Powers',
  baseUrl: '/elf/',
  url: 'https://ngneat.github.io',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'ngneat',
  projectName: 'elf',
  themeConfig: {
    algolia: {
      apiKey: '129bed74e0b4d728358bf7b123274c18',
      indexName: 'elf',
    },
    navbar: {
      title: 'Elf',
      logo: {
        alt: 'Elf',
        src: 'img/elf.png',
      },
      items: [
        {
          to: 'docs/store',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/ngneat/elf',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs/store',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discussions',
              href: 'https://github.com/ngneat/elf/discussions',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/NetanelBasal',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ngneat/elf',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Elf, Inc.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/ngneat/elf/docusaurus/edit/main/website/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
