import React, { ReactNode } from 'react';

import { Config } from '../hooks';

import {
  makeStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Box from '@mui/material/Box';

type DrawerContentProps = {
  toggleDrawer: (isOpen: boolean) => void;
  item: Config;
  setItem: (item: Config) => void;
  readOnly?: boolean;
  loading?: boolean;
  save: () => Promise<void>;
  title: string;
  children: ReactNode;
  disabledSave?: boolean;
};

const useDrawerContentStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    icon: {
      fontSize: 20,
    },
    content: {
      height: '80%',
      padding: '10px',
      color: theme.palette.common.white,
    },
    secondaryAction: {
      marginLeft: theme.spacing(2.5),
    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
  }),
);

export const DrawerTemplateContent = ({
    toggleDrawer,
    readOnly = true,
    disabledSave,
    save,
    loading,
    title,
    children
  }: DrawerContentProps) => {
    const classes = useDrawerContentStyles();
  
    return (
      <>
        <div className={classes.header}>
          <Typography variant="h5">{title}</Typography>
          <IconButton
            key="dismiss"
            title="Close the drawer"
            onClick={() => toggleDrawer(false)}
            color="inherit"
          >
            <Close className={classes.icon} />
          </IconButton>
        </div>
        <div className={classes.content}>
          { children }
        </div>
        <div className={classes.actions}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => toggleDrawer(false)}
          >
            Close
          </Button>
          <Button
            className={classes.secondaryAction}
            variant="contained"
            color="primary"
            onClick={() => save()}
            disabled={readOnly || disabledSave}
          >
            <Box
              sx={{ display: 'flex', minWidth: '45px', justifyContent: 'center' }}
            >
              {!loading && 'Save'}
              {loading && <CircularProgress color="inherit" size={22} />}
            </Box>
          </Button>
        </div>
      </>
    );
  };