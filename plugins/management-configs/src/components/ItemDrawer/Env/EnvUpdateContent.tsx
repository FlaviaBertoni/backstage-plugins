import React, { useState } from 'react';

import { usePermission } from '@backstage/plugin-permission-react';
import { manegementConfigsEnvsCreatePermission } from '@internal/plugin-management-configs-common';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

import { Grid } from '@material-ui/core';
import TextField from '@mui/material/TextField';

import { useConfigUpdate } from '../../hooks/useConfig';

import { ItemDrawerProps } from '../ItemDrawer';
import { DrawerTemplateContent } from '../DrawerTemplateContent';

export const EnvUpdateContent = (props: ItemDrawerProps) => {
  const { toggleDrawer, item, setItem } = props;
  const [loading, setLoading] = useState(false);

  const alertApi = useApi(alertApiRef);
  const { update } = useConfigUpdate();
  const createPermissionResult = usePermission({ permission: manegementConfigsEnvsCreatePermission });
  const readOnly = !createPermissionResult?.allowed;

  if (!item || !setItem) {
    alertApi.post({
      message: `Error on load config: item or setItem is undefined.`,
      severity: 'error',
    });

    return <></>;
  }

  const save = async () => {
    setLoading(true);

    try {
      await update(item);
    } catch (e: any) {
      setLoading(false);
      alertApi.post({
        message: `Error on save: ${e?.message}`,
        severity: 'error',
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
      <Grid container spacing={3} direction="column" data-testid="env-update-content">
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
              multiline
              label="Value"
              value={item.value || ''}
              rows={4}
              InputProps={{ readOnly }}
              onChange={(e) =>
                setItem({ ...item, value: e.target.value })
              }
          />
        </Grid>
      </Grid>
    </DrawerTemplateContent>
  );
};
