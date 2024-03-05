import React, { useState } from 'react';

import { usePermission } from '@backstage/plugin-permission-react';
import { manegementConfigsFeatureFlagCreatePermission } from '@fbertoni/backstage-plugin-management-configs-common';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

import { Grid } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import { Config } from '../../hooks';
import { useConfigCreate } from '../../hooks/useConfig';

import { ItemDrawerProps } from '../ItemDrawer';
import { DrawerTemplateContent } from '../DrawerTemplateContent';

export const FeatureFlagCreateContent = (props: ItemDrawerProps) => {
  const { toggleDrawer, type } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ key: '' });
  const [item, setItem] = useState<Config>({
    key: '',
    updatedOn: '',
    value: '',
    type,
  });

  const alertApi = useApi(alertApiRef);
  const { create } = useConfigCreate();
  const createPermissionResult = usePermission({ permission: manegementConfigsFeatureFlagCreatePermission });
  const readOnly = !createPermissionResult?.allowed;

  const save = async () => {

    try {

      if (!item.key) setError({ ...error, key: 'required field' });

      if (!item || !item.key) {
        return alertApi.post({
          message: 'Invalid feature flag, please fill required values.',
          severity: 'error',
        });
      }

      setLoading(true);
      await create(item);
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
      title="Create Feature Flag"
      toggleDrawer={toggleDrawer}
      item={item}
      setItem={setItem}
      readOnly={readOnly}
      save={save}
      loading={loading}
    >
      <Grid container spacing={3} direction="column" data-testid="feature-flag-create-content">
        <Grid item>
          <TextField
            id="item-key"
            required
            fullWidth
            label="Key"
            variant="outlined"
            value={item.key}
            InputProps={{ readOnly }}
            onChange={e => setItem({ ...item, key: e.target.value })}
            onFocus={() => setError({ ...error, key: '' }) }
            error={!!error.key}
            helperText={error.key}
          />
        </Grid>

        <Grid item>
          <FormControlLabel
            disabled={readOnly}
            label={item.value ? 'Enabled' : 'Disabled'}
            control={
              <Switch
                id="item-value"
                checked={Boolean(item.value)}
                onChange={e => {
                    setItem({ ...item, value: e.target.checked })}
                  }
              />
            }
          />
        </Grid>
      </Grid>
    </DrawerTemplateContent>
  );
};
