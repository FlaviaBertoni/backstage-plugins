import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { managementConfigsPlugin, ManagementConfigsPage } from '../src/plugin';

createDevApp()
  .registerPlugin(managementConfigsPlugin)
  .addPage({
    element: <ManagementConfigsPage />,
    title: 'Root Page',
    path: '/management-configs'
  })
  .render();
