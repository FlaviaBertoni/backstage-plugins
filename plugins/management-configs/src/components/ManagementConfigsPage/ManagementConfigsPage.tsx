import React from 'react';
import { Grid } from '@material-ui/core';
import { Header, Page, Content } from '@backstage/core-components';

import { ConfigType, ConfigsProvider } from '../hooks/ConfigsContext';
import { ManagementConfigs } from '../ManagementConfigs';

export const ManagementConfigsPage = () => (
  <Page themeId="management-configs">
    <Header title="Welcome to Management-configs!" />
    <Content>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <ConfigsProvider
              type={ConfigType.Secret}
              namespace="default"
              name="keyvaulttest"
          >
            <ManagementConfigs
              title="KeyVault Secrets List"
            />
          </ConfigsProvider>
        </Grid>
      </Grid>
    </Content>
  </Page>
);
