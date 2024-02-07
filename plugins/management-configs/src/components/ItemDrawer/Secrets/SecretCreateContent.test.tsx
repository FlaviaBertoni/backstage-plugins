import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { SecretCreateContent } from './SecretCreateContent';

import { ItemDrawerProps, DrawerType  } from '../ItemDrawer';
import { ConfigType } from '../../hooks/ConfigsContext';

const mockPost = jest.fn();
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => ({ post: mockPost }),
  alertApiRef: 'alertApiRef'
}));

const mockCreate = jest.fn();
jest.mock('../../hooks/useConfig', () => ({
  useConfigCreate: () => ({ create: mockCreate }),
}));

jest.mock('@backstage/plugin-permission-react', () => ({
  usePermission: () => ({ allowed: true }),
}));

describe('SecretCreateContent Component', () => {

  const props = {
    isOpen: true,
    toggleDrawer: jest.fn(),
    drawerType: DrawerType.Create, 
    type: ConfigType.Secret
  } as unknown as ItemDrawerProps;

  it('should call change value correctly for all fields', async () => {
    const { getByLabelText } = render(<SecretCreateContent {...props}/>);

    const inputKey = getByLabelText(/Key/i);
    fireEvent.change(inputKey, {target: {value: 'key name'}});
    expect(inputKey).toHaveValue('key name');

    const inputValue = getByLabelText('Value');
    fireEvent.change(inputValue, {target: {value: 'value'}});
    expect(inputValue).toHaveValue('value');
  });

  it('should call create function when "Save" button is clicked', () => {
    const { getByText, getByLabelText } = render(<SecretCreateContent {...props} />);

    const secret = { key: 'secret-key', value: 'secret key test value', type: ConfigType.Secret, updatedOn: '' };
    fireEvent.change(getByLabelText(/Key/i), {target: {value: secret.key}});
    fireEvent.change(getByLabelText('Value'), {target: {value: secret.value}});

    fireEvent.click(getByText('Save'));

    expect(mockCreate).toHaveBeenCalledWith(secret);
  });

  it('should show alert error when secret is invalid', async () => {
    const { getByText } = render(<SecretCreateContent {...props} />);

    await waitFor(() => { fireEvent.click(getByText('Save')) });

    expect(mockPost).toHaveBeenCalledWith({ "message": "Invalid secret, please fill required values.", "severity": "error" });
  });

  it('should show alert when update function failed', async () => {
    mockCreate.mockRejectedValue(new Error('Failed'));
    const { getByText, getByLabelText } = render(<SecretCreateContent {...props} />);

    fireEvent.change(getByLabelText(/Key/i), {target: {value: 'secret-key'}});
    fireEvent.change(getByLabelText('Value'), {target: {value: 'secret key test value'}});

    await waitFor(() => { fireEvent.click(getByText('Save')) });

    expect(mockPost).toHaveBeenCalledWith({ "message": "Error on save: Failed", "severity": "error" });
  });
});
