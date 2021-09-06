/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

module.exports = {
  docs: [
    {
      type: 'doc',
      label: 'Installation',
      id: 'installation',
    },
    {
      type: 'doc',
      label: 'The Store',
      id: 'store',
    },
    {
      type: 'doc',
      label: 'The Repository Pattern',
      id: 'repository',
    },
    {
      type: 'category',
      label: 'Entities',
      collapsed: false,
      items: [
        'features/entities/entities',
        'features/entities/ui-entities',
        'features/entities/active-ids',
      ],
    },
    'features/requests',
    'features/pagination',
    'features/caching',
    'features/persist-state',
    'features/history',
    'features/props',
    'dev-tools',
    'cli',
    'faq',
  ],
};
