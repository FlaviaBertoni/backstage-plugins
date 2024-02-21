import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { SecretUpdateContent } from './SecretUpdateContent';

import { ItemDrawerProps, DrawerType  } from '../ItemDrawer';
import { ConfigType } from '../../hooks/ConfigsContext';

const mockPost = jest.fn();
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => ({ post: mockPost }),
  alertApiRef: 'alertApiRef'
}));

const mockUpdate = jest.fn();
const mockGetConfigValue = jest.fn();
jest.mock('../../hooks/useConfig', () => ({
  useConfigUpdate: () => ({ update: mockUpdate }),
  useConfigGet: () => ({ getConfigValue: mockGetConfigValue }),
}));

jest.mock('@backstage/plugin-permission-react', () => ({
  usePermission: () => ({ allowed: true }),
}));

describe('SecretUpdateContent Component', () => {

  const props = {
    isOpen: true,
    toggleDrawer: jest.fn(),
    item: { key: 'key-name', value: 'value', type: 'secret', createdOn: '2023-08-15T10:50:10.000Z', updatedOn: '2023-08-17T15:58:14.000Z' },
    setItem: jest.fn(),
    drawerType: DrawerType.Update, 
    type: ConfigType.Secret
  } as unknown as ItemDrawerProps;

  it('should call setItem corretly for all fields', async () => {
    const { getByLabelText, getByTestId } = render(<SecretUpdateContent {...props}/>);

    const inputKeyReadOnly = getByLabelText('Key');
    fireEvent.change(inputKeyReadOnly, {target: {value: 'other value'}});
    expect(props.setItem).not.toHaveBeenCalled();

    const inputCreatedOnReadOnly = getByLabelText('Created On');
    fireEvent.change(inputCreatedOnReadOnly, {target: { value: 'other value' }});
    expect(props.setItem).not.toHaveBeenCalled();

    const inputUpdatedOnReadOnly = getByLabelText('Updated On');
    fireEvent.change(inputUpdatedOnReadOnly, {target: { value: 'other value' }});
    expect(props.setItem).not.toHaveBeenCalled();

    fireEvent.click(getByTestId("edit-button"));
    const inputValue = getByLabelText('New secret value');
    fireEvent.change(inputValue, {target: {value: 'new value'}});
    expect(props.setItem).toHaveBeenCalledWith({ ...props.item, value: 'new value' });
  });

  it('should call update function when "Save" button is clicked', () => {
    const { getByText } = render(<SecretUpdateContent {...props} />);

    fireEvent.click(getByText('Save'));

    expect(mockUpdate).toHaveBeenCalledWith(props.item);
  });

  it('should show alert when update function failed', async () => {
    mockUpdate.mockRejectedValue(new Error('Failed'));
    const { getByText } = render(<SecretUpdateContent {...props} />);

    await waitFor(() => { fireEvent.click(getByText('Save')) });

    expect(mockPost).toHaveBeenCalledWith({ "message": "Error on save: Failed", "severity": "error" });
  });
});
