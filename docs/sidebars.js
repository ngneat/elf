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
    'installation',
    'store',
    'repository',
    {
      type: 'category',
      label: 'Entities',
      collapsed: false,
      items: [
        'features/entities/entities',
        'features/entities/ui-entities',
        'features/entities/active-ids',
        'features/entities/entities-props-factory',
      ],
    },
    {
      type: 'category',
      label: 'Requests',
      collapsed: false,
      items: [
        'features/requests/requests-status',
        'features/requests/requests-cache',
        'features/requests/requests-data-source',
      ],
    },
    'features/pagination',
    'features/persist-state',
    'features/history',
    'dev-tools',
    'immer',
    'cli',
    'side-effects',
    {
      type: 'category',
      label: 'Miscellaneous',
      collapsed: false,
      items: [
        'miscellaneous/props-factory',
        'miscellaneous/operators',
        'miscellaneous/registry',
        'miscellaneous/hooks',
        'miscellaneous/batching',
      ],
    },
    'recipes',
    'faq',
  ],
};
