import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { FeatureFlagUpdateContent } from './FeatureFlagUpdateContent';

import { ItemDrawerProps, DrawerType  } from '../ItemDrawer';
import { ConfigType } from '../../hooks/ConfigsContext';

const mockPost = jest.fn();
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => ({ post: mockPost }),
  alertApiRef: 'alertApiRef'
}));

const mockUpdate = jest.fn();
jest.mock('../../hooks/useConfig', () => ({
  useConfigUpdate: () => ({ update: mockUpdate }),
}));

jest.mock('@backstage/plugin-permission-react', () => ({
  usePermission: () => ({ allowed: true }),
}));

describe('FeatureFlagUpdateContent Component', () => {

  const props = {
    isOpen: true,
    toggleDrawer: jest.fn(),
    item: { key: 'key-name', value: false, createdOn: '2023-08-15T10:50:10.000Z', updatedOn: '2023-08-17T15:58:14.000Z' },
    setItem: jest.fn(),
    drawerType: DrawerType.Update, 
    type: ConfigType.FeatureFlag
  } as unknown as ItemDrawerProps;

  it('should call setItem corretly for all fields', async () => {
    const { getByLabelText, getByRole } = render(<FeatureFlagUpdateContent {...props}/>);

    const inputKeyReadOnly = getByLabelText('Key');
    fireEvent.change(inputKeyReadOnly, {target: {value: 'other value'}});
    expect(props.setItem).not.toHaveBeenCalled();

    const inputCreatedOnReadOnly = getByLabelText('Created On');
    fireEvent.change(inputCreatedOnReadOnly, {target: { value: 'other value' }});
    expect(props.setItem).not.toHaveBeenCalled();

    const inputUpdatedOnReadOnly = getByLabelText('Updated On');
    fireEvent.change(inputUpdatedOnReadOnly, {target: { value: 'other value' }});
    expect(props.setItem).not.toHaveBeenCalled();

    const checkboxValue = getByRole('checkbox');
    fireEvent.click(checkboxValue);
    expect(props.setItem).toHaveBeenCalledWith({ ...props.item, value: true });
  });

  it('should call update function when "Save" button is clicked', () => {
    const { getByText } = render(<FeatureFlagUpdateContent {...props} />);

    fireEvent.click(getByText('Save'));

    expect(mockUpdate).toHaveBeenCalledWith(props.item);
  });

  it('should show alert when update function failed', async () => {
    mockUpdate.mockRejectedValue(new Error('Failed'));
    const { getByText } = render(<FeatureFlagUpdateContent {...props} />);

    await waitFor(() => { fireEvent.click(getByText('Save')) });

    expect(mockPost).toHaveBeenCalledWith({ "message": "Error on save: Failed", "severity": "error" });
  });
});
