import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ConfirmDeletionDialog, ConfirmDeletionDialogProps } from './ConfirmDeletionDialog';

import { ConfigType } from '../hooks/ConfigsContext';

describe('ConfirmDeletionDialog Component', () => {

    const props = {
      open: true,
      handleClose: jest.fn(),
      handleClick: jest.fn(),
      configKey: 'ft-user-forgot-password',
      type: ConfigType.FeatureFlag,
    } as unknown as ConfirmDeletionDialogProps;

  it('should render component', async () => {
    const { findByText } = render(<ConfirmDeletionDialog {...props}/>);

    await findByText(/Do you really want to delete featureflag ft-user-forgot-password/i);

    expect(document.body).toMatchSnapshot();
  });

  it('should call handleClick function when "Delete" button is clicked', () => {
    const { getByText } = render(<ConfirmDeletionDialog {...props} />);

    fireEvent.click(getByText('Delete'));

    expect(props.handleClick).toHaveBeenCalled();
  });

  it('should call handleClose function when "Cancel" button is clicked', () => {
    const { getByText } = render(<ConfirmDeletionDialog {...props} />);

    fireEvent.click(getByText('Cancel'));

    expect(props.handleClose).toHaveBeenCalled();
  });
});
