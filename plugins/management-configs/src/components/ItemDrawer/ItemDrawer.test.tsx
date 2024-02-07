import React from 'react';
import { render } from '@testing-library/react';
import { ItemDrawer, ItemDrawerProps, DrawerType } from './ItemDrawer';

import { ConfigType } from '../hooks/ConfigsContext';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => ({ post: jest.fn() }),
  alertApiRef: 'alertApiRef'
}));

jest.mock('../hooks/useConfig', () => ({
  useConfigUpdate: () => ({ update: jest.fn() }),
  useConfigCreate: () => ({ create: jest.fn() }),
}));

describe('ItemDrawer Component', () => {

    const props = {
      isOpen: true,
      toggleDrawer: jest.fn(),
      item: { key: 'key-name', value: 'value', updatedOn: '2023-08-17T15:58:14.000Z' },
      setItem: jest.fn()
    } as unknown as ItemDrawerProps;

  it('should render component to update feature flag correctly', async () => {
    const updateFeatureFlagProps = { ...props, drawerType: DrawerType.Update, type: ConfigType.FeatureFlag };
    const { findByTestId } = render(<ItemDrawer {...updateFeatureFlagProps}/>);

    await findByTestId("feature-flag-update-content");

    expect(document.body).toMatchSnapshot();
  });

  it('should render component to create feature flag correctly', async () => {
    const updateFeatureFlagProps = { ...props, drawerType: DrawerType.Create, type: ConfigType.FeatureFlag };
    const { findByTestId } = render(<ItemDrawer {...updateFeatureFlagProps}/>);

    await findByTestId("feature-flag-create-content");

    expect(document.body).toMatchSnapshot();
  });

  it('should render component to update env correctly', async () => {
    const updateFeatureFlagProps = { ...props, drawerType: DrawerType.Update, type: ConfigType.Env };
    const { findByTestId } = render(<ItemDrawer {...updateFeatureFlagProps}/>);

    await findByTestId("env-update-content");

    expect(document.body).toMatchSnapshot();
  });

  it('should render component to create env correctly', async () => {
    const updateFeatureFlagProps = { ...props, drawerType: DrawerType.Create, type: ConfigType.Env };
    const { findByTestId } = render(<ItemDrawer {...updateFeatureFlagProps}/>);

    await findByTestId("env-create-content");

    expect(document.body).toMatchSnapshot();
  });

  it('should render component to update secret correctly', async () => {
    const updateFeatureFlagProps = { ...props, drawerType: DrawerType.Update, type: ConfigType.Secret };
    const { findByTestId } = render(<ItemDrawer {...updateFeatureFlagProps}/>);

    await findByTestId("secret-update-content");

    expect(document.body).toMatchSnapshot();
  });

  it('should render component to create secret correctly', async () => {
    const updateFeatureFlagProps = { ...props, drawerType: DrawerType.Create, type: ConfigType.Secret };
    const { findByTestId } = render(<ItemDrawer {...updateFeatureFlagProps}/>);

    await findByTestId("secret-create-content");

    expect(document.body).toMatchSnapshot();
  });
 
});
