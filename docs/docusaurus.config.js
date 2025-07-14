const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.nightOwlLight;
const darkCodeTheme = themes.oceanicNext;

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
    metadata: [
      {
        name: 'google-site-verification',
        content: 'zLIQAxOp2sGFy10UE51HAMtWTqg7J8z1hpTxZR9G1WA',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:domain', content: 'ngneat.github.io' },
      { property: 'twitter:url', content: 'https://ngneat.github.io/elf/' },
      { name: 'twitter:title', content: 'Elf 🧝' },
      {
        name: 'twitter:description',
        content: 'A Reactive Store with Magical Powers',
      },
      {
        name: 'twitter:image',
        content: 'https://ngneat.github.io/elf/img/elf.png',
      },
      { property: 'og:url', content: 'https://ngneat.github.io/elf/' },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Elf 🧝' },
      {
        property: 'og:description',
        content: 'A Reactive Store with Magical Powers',
      },
      {
        property: 'og:image',
        content: 'https://ngneat.github.io/elf/img/elf.png',
      },
    ],
    algolia: {
      appId: 'GSDPQ4A8PM',
      apiKey: 'a7655f6472e9024f257027fa9b4e9e7e',
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
          className: 'first-nav-element',
        },
        {
          href: 'https://github.com/sponsors/ngneat',
          label: 'Sponsor',
          position: 'right',
          className: 'header-icon-link header-sponsor-link',
        },
        {
          href: 'https://github.com/ngneat/elf/',
          label: ' ',
          position: 'right',
          className: 'header-icon-link header-github-link',
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
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/ngneat/elf',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/ngneat_org',
            },
            {
              label: 'YouTube',
              href: 'https://youtube.com/@ngneat',
            },
            {
              label: 'Official site',
              href: 'https://ngneat.com/',
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
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            from: '/docs/features/entities/entities',
            to: '/docs/features/entities-management/entities',
          },
          {
            from: '/docs/features/entities/ui-entities',
            to: '/docs/features/entities-management/ui-entities',
          },
          {
            from: '/docs/features/entities/active-ids',
            to: '/docs/features/entities-management/active-ids',
          },
          {
            from: '/docs/features/entities/entities-props-factory',
            to: '/docs/features/entities-management/entities-props-factory',
          },
        ],
      },
    ],
  ],
};
