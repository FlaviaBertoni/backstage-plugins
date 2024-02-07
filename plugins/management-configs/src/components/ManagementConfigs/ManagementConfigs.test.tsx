import React from 'react';
import { render } from '@testing-library/react';

import { ManagementConfigs } from './ManagementConfigs';
import { ConfigType, useConfigsContext } from '../hooks/ConfigsContext';

jest.mock('../hooks/ConfigsContext', () => ({
  ...jest.requireActual('../hooks/ConfigsContext'),
  useConfigsContext: jest.fn(),
}));

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => ({ post: jest.fn() }),
  alertApiRef: 'alertApiRef'
}));

describe('ManagementConfigs Component', () => {

  const configsContextState = { 
    configs: [{"key":"APP_KEY_1","createdOn":"2023-08-17T15:58:14.000Z","updatedOn":"2023-08-17T15:58:14.000Z", "value": "VALUE_APP_KEY_1"},{ "key":"APP_KEY_2","createdOn":"2023-06-08T19:27:05.000Z","updatedOn":"2023-06-08T19:27:05.000Z", "value": "VALUE_APP_KEY_2" } ], 
    loading: false, 
  };

  it('should render management secrets correctly', async () => {
    (useConfigsContext as jest.Mock).mockReturnValue({ ...configsContextState, type: ConfigType.Secret  });
    const { findByTestId } = render(<ManagementConfigs title="Title"/>);

    await findByTestId("management-secrets");

    expect(document.body).toMatchSnapshot();
  });

  it('should render management envs correctly', async () => {
    (useConfigsContext as jest.Mock).mockReturnValue({ ...configsContextState, type: ConfigType.Env  });
    const { findByTestId } = render(<ManagementConfigs title="Title"/>);

    await findByTestId("management-envs");

    expect(document.body).toMatchSnapshot();
  });

  it('should render management FeatureFlags correctly', async () => {
    (useConfigsContext as jest.Mock).mockReturnValue({ ...configsContextState, type: ConfigType.FeatureFlag  });
    const { findByTestId } = render(<ManagementConfigs title="Title"/>);

    await findByTestId("management-featureflags");

    expect(document.body).toMatchSnapshot();
  });

  it('should render loading correctly', async () => {
    (useConfigsContext as jest.Mock).mockReturnValue({ ...configsContextState, loading: true, type: ConfigType.Env  });
    const { queryByTestId } = render(<ManagementConfigs title="Title"/>);

    expect(queryByTestId("management-envs")).not.toBeInTheDocument();

    expect(document.body).toMatchSnapshot();
  });

  it('should render error panel correctly', async () => {
    (useConfigsContext as jest.Mock).mockReturnValue({ ...configsContextState, error: new Error('Loading error'), type: ConfigType.Env  });
    const { queryByTestId, getByText } = render(<ManagementConfigs title="Title"/>);

    getByText('Loading error');
    expect(queryByTestId("management-envs")).not.toBeInTheDocument();

    expect(document.body).toMatchSnapshot();
  });

  it('should render error panel correctly when type is not founded', async () => {
    (useConfigsContext as jest.Mock).mockReturnValue({ ...configsContextState, type: 'unknow' });
    const { queryByTestId, getByText } = render(<ManagementConfigs title="Title"/>);

    getByText('Config type not found.');
    expect(queryByTestId("management-envs")).not.toBeInTheDocument();

    expect(document.body).toMatchSnapshot();
  });
 
});
