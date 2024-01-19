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
    {
      type: 'category',
      label: 'Design Patterns',
      items: ['repository', 'facade'],
    },
    {
      type: 'category',
      label: 'Entities Management',
      collapsed: false,
      items: [
        'features/entities-management/entities',
        'features/entities-management/ui-entities',
        'features/entities-management/active-ids',
        'features/entities-management/entities-props-factory',
      ],
    },
    // {
    //   type: 'category',
    //   label: 'Requests',
    //   collapsed: false,
    //   items: [
    //     'features/requests/requests-status',
    //     'features/requests/requests-cache',
    //     'features/requests/requests-data-source',
    //   ],
    // },
    'features/requests-result',
    'features/pagination',
    'features/persist-state',
    {
      type: 'category',
      label: 'History',
      collapsed: false,
      items: ['features/history/history', 'features/history/entities-history'],
    },
    'dev-tools',
    'immer',
    'cli',
    'side-effects',
    {
      type: 'category',
      label: 'Miscellaneous',
      collapsed: false,
      items: [
        'miscellaneous/production',
        'miscellaneous/props-factory',
        'miscellaneous/operators',
        'miscellaneous/registry',
        'miscellaneous/hooks',
        'miscellaneous/batching',
        'miscellaneous/entity-events',
      ],
    },
    'recipes',
    {
      type: 'category',
      label: 'Third Party Libraries',
      collapsed: false,
      items: ['third-party/sync-state'],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      collapsed: false,
      items: ['troubleshooting/stale-emission'],
    },
    'faq',
  ],
};
