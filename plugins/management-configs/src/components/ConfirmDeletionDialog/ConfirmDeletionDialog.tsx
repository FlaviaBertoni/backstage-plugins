import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClick} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
};