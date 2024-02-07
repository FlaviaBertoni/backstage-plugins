import React, { useState } from 'react';

import { usePermission } from '@backstage/plugin-permission-react';
import { manegementConfigsSecretsCreatePermission } from '@internal/plugin-management-configs-common';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

import { Grid } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { useConfigUpdate, useConfigGet } from '../../hooks/useConfig';

import { ItemDrawerProps } from '../ItemDrawer';
import { DrawerTemplateContent } from '../DrawerTemplateContent';
import { Config } from '../../hooks/ConfigsContext';

const DEFAULT_SECRET_HIDE_VALUE = "************************";

export const SecretUpdateContent = (props: ItemDrawerProps) => {
  const { toggleDrawer, setItem } = props;
  const [loading, setLoading] = useState(false);
  const [showSecretValue, setShowSecretValue] = useState(false);
  const [value, setValue] = useState(DEFAULT_SECRET_HIDE_VALUE);

  const alertApi = useApi(alertApiRef);
  const { update } = useConfigUpdate();
  const { getConfigValue } = useConfigGet();
  const createPermissionResult = usePermission({ permission: manegementConfigsSecretsCreatePermission });
  const readOnly = !createPermissionResult?.allowed;

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

  return (
    <DrawerTemplateContent
      title="Details"
      toggleDrawer={toggleDrawer}
      item={item}
      setItem={setItem}
      readOnly={readOnly}
      save={save}
      loading={loading}
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

          <Grid item>
            <TextField
                id="item-value"
                fullWidth
                label="Value"
                value={value}
                InputProps={{ 
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShow}
                        onMouseDown={handleMouseDownShow}
                        disabled={loading}
                        edge="end"
                      >
                        {showSecretValue ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
            />
          </Grid>
        </Grid>
    </DrawerTemplateContent>
  );
};
