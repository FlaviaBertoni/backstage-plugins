import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const managementConfigsPlugin = createPlugin({
  id: 'management-configs',
  routes: {
    root: rootRouteRef,
  },
});

export const ManagementConfigsPage = managementConfigsPlugin.provide(
  createRoutableExtension({
    name: 'ManagementConfigsPage',
    component: () =>
      import('./components/ManagementConfigsPage').then(m => m.ManagementConfigsPage),
    mountPoint: rootRouteRef,
  }),
);
