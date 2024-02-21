import React, { useState } from 'react';

import { usePermission } from '@backstage/plugin-permission-react';
import { manegementConfigsSecretsCreatePermission, manegementConfigsSecretsShowValuePermission } from '@internal/plugin-management-configs-common';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

import { Grid, Button } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Cancel';

import { useConfigUpdate, useConfigGet } from '../../hooks/useConfig';

import { ItemDrawerProps } from '../ItemDrawer';
import { DrawerTemplateContent } from '../DrawerTemplateContent';
import { Config } from '../../hooks/ConfigsContext';

const DEFAULT_SECRET_HIDE_VALUE = "************************";

export const SecretUpdateContent = (props: ItemDrawerProps) => {
  const { toggleDrawer, setItem } = props;
  const [loading, setLoading] = useState(false);
  const [showSecretValue, setShowSecretValue] = useState(false);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(DEFAULT_SECRET_HIDE_VALUE);

  const alertApi = useApi(alertApiRef);
  const { update } = useConfigUpdate();
  const { getConfigValue } = useConfigGet();
  const createPermissionResult = usePermission({ permission: manegementConfigsSecretsCreatePermission });
  const showSecretValuePermissionResult = usePermission({ permission: manegementConfigsSecretsShowValuePermission });

  const readOnly = !createPermissionResult?.allowed;
  const showSecretValueAllowed = showSecretValuePermissionResult?.allowed;

  const item = { type: props.type, ...props.item } as Config;
  if (!item || !setItem) {
    alertApi.post({
      message: `Error on load config: item or setItem is undefined.`,
      severity: 'error',
    });

    return <></>;
  }

  const handleClickShow = async () => {

    const showValue = !showSecretValue;

    if (showValue) {
      try {
        setLoading(true);
        setValue(await getConfigValue(item));
        setShowSecretValue(showValue);
      } catch (e: any) {
        alertApi.post({
          message: `Error on get secret value: ${e?.message}`,
          severity: 'error',
          display: 'transient'
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    setValue(DEFAULT_SECRET_HIDE_VALUE);
    setShowSecretValue(showValue);
  }

  const handleMouseDownShow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleEditValue = () => {
    const isEditing = !editing;
    setEditing(isEditing);

    if (!isEditing) {
      setItem({ ...item, value: '' });
      setValue(DEFAULT_SECRET_HIDE_VALUE);
      setShowSecretValue(false);
    }
  };

  const save = async () => {
    setLoading(true);

    try {
      await update(item);
    } catch (e: any) {
      setLoading(false);
      alertApi.post({
        message: `Error on save: ${e?.message}`,
        severity: 'error'
      });
    }
  };

  const ReadInput = (
    <TextField
      id="item-value"
      fullWidth
      label="Value"
      value={value}
      InputProps={{ 
        readOnly: true,
        endAdornment: showSecretValueAllowed && (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle visibility"
              onClick={handleClickShow}
              onMouseDown={handleMouseDownShow}
              disabled={loading}
              edge="end"
            >
              {showSecretValue ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );

  const EditInput = (
    <TextField
      id="editing-item-value"
      fullWidth
      multiline
      label="New secret value"
      value={item.value}
      rows={3}
      onChange={(e) =>
        setItem({ ...item, value: e.target.value })
      }
    />
  );

  return (
    <DrawerTemplateContent
      title="Details"
      toggleDrawer={toggleDrawer}
      item={item}
      setItem={setItem}
      readOnly={readOnly}
      save={save}
      loading={loading}
      disabledSave={!item.value}
    >
        <Grid container spacing={3} direction="column" data-testid="secret-update-content">
          <Grid item>
            <TextField
              id="item-key"
              fullWidth
              label="Key"
              value={item.key}
              InputProps={{ readOnly: true }}
            />
          </Grid>

          { item.createdOn && <Grid item>
            <TextField
              id="item-createdOn"
              fullWidth
              label="Created On"
              value={item.createdOn}
              InputProps={{ readOnly: true }}
            />
          </Grid>}

          { item.updatedOn && <Grid item>
            <TextField
              id="item-updatedOn"
              fullWidth
              label="Updated On"
              value={item.updatedOn}
              InputProps={{ readOnly: true }}
            />
          </Grid>}

          <Grid item container spacing={1}>
     
            <Grid item xs={10}>
              {editing ? EditInput : ReadInput }
            </Grid>

            <Grid item xs justifyContent="flex-end" alignItems="center">
                <Tooltip title={editing ? "Cancel editing" : "Edit value"}>
                  <Button
                    data-testid="edit-button"
                    aria-label="edit value"
                    onClick={handleEditValue}
                    variant="outlined"
                    color="primary"
                    style={{ height: '100%' }}
                    fullWidth
                  >
                    { editing ? <CancelIcon /> : <EditIcon /> }
                  </Button>
                </Tooltip>
            </Grid>

          </Grid>
          
        </Grid>
    </DrawerTemplateContent>
  );
};
