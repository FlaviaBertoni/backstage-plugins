import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ConfigType } from '../hooks/ConfigsContext';

export type ConfirmDeletionDialogProps = {
    open: boolean;
    handleClose: () => void;
    handleClick: () => void;
    configKey: string;
    type?: ConfigType;
  };

export const ConfirmDeletionDialog = (props: ConfirmDeletionDialogProps) => {
    const { open, handleClose, handleClick, type, configKey } = props;
  
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="confirm-deletion-title"
      >
        <DialogTitle id="confirm-deletion-title">
          Confirm deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Do you really want to delete {type} {configKey}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClick}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
};