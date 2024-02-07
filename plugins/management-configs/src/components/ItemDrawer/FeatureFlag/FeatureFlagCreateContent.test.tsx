import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { FeatureFlagCreateContent } from './FeatureFlagCreateContent';

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

describe('FeatureFlagCreateContent Component', () => {

  const props = {
    isOpen: true,
    toggleDrawer: jest.fn(),
    drawerType: DrawerType.Create, 
    type: ConfigType.FeatureFlag
  } as unknown as ItemDrawerProps;

  it('should call change value correctly for all fields', async () => {
    const { getByLabelText, getByRole } = render(<FeatureFlagCreateContent {...props}/>);

    const inputKey = getByLabelText(/Key/i);
    fireEvent.change(inputKey, {target: {value: 'key name'}});
    expect(inputKey).toHaveValue('key name');

    const checkboxValue = getByRole('checkbox');
    fireEvent.click(checkboxValue);
    expect(checkboxValue).toBeChecked();
  });

  it('should call create function when "Save" button is clicked', async () => {
    const { getByText, getByLabelText, getByRole } = render(<FeatureFlagCreateContent {...props} />);

    const featureflag = { key: 'feature-flag-test-key', value: true, type: ConfigType.FeatureFlag, updatedOn: '' };

    const inputKey = getByLabelText(/Key/i);
    fireEvent.change(inputKey, {target: {value: featureflag.key}});

    const checkboxValue = getByRole('checkbox');
    fireEvent.click(checkboxValue);

    await waitFor(() => { fireEvent.click(getByText('Save')) });

    expect(mockCreate).toHaveBeenCalledWith(featureflag); 
  });

  it('should show alert error when feature flag is invalid', async () => {
    const { getByText } = render(<FeatureFlagCreateContent {...props} />);

    await waitFor(() => { fireEvent.click(getByText('Save')) });

    expect(mockPost).toHaveBeenCalledWith({ "message": "Invalid feature flag, please fill required values.", "severity": "error" });
  });

  it('should show alert when update function failed', async () => {
    mockCreate.mockRejectedValue(new Error('Failed'));
    const { getByText, getByLabelText, getByRole } = render(<FeatureFlagCreateContent {...props} />);

    const inputKey = getByLabelText(/Key/i);
    fireEvent.change(inputKey, {target: {value: 'key name'}});

    const checkboxValue = getByRole('checkbox');
    fireEvent.change(checkboxValue, {target: {checked: true}});

    await waitFor(() => { fireEvent.click(getByText('Save')) });

    expect(mockPost).toHaveBeenCalledWith({ "message": "Error on save: Failed", "severity": "error" });
  });
});
