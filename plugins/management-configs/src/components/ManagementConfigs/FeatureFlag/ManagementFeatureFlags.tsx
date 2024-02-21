import React, { useState } from 'react';

import { Progress } from '@backstage/core-components';
import OpenInNew from '@material-ui/icons/OpenInNew';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';

import { usePermission } from '@backstage/plugin-permission-react';
import {
  manegementConfigsFeatureFlagCreatePermission,
  manegementConfigsFeatureFlagDeletePermission,
} from '@fbertoni/backstage-plugin-management-configs-common';
import { alertApiRef, useApi } from '@backstage/core-plugin-api';

import { Config, ConfigType } from '../../hooks/ConfigsContext';
import { ItemDrawer, DrawerType } from '../../ItemDrawer';
import { ConfirmDeletionDialog } from '../../ConfirmDeletionDialog';
import { useConfigDelete } from '../../hooks/useConfig';
import { ConfigsTable } from '../ConfigsTable';

type ManagementConfigsProps = {
  configs: Config[];
  title: string;
};

export const ManagementFeatureFlags = ({ configs, title }: ManagementConfigsProps) => {

  const type = ConfigType.FeatureFlag;

  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [drawerType, setDrawerType] = useState<DrawerType>(DrawerType.Update);
  const [item, setItem] = useState<Config>({ key: '', createdOn: '', updatedOn: '', value: '', type });

  const alertApi = useApi(alertApiRef);
  const { deleteConfig } = useConfigDelete();
  const createPermission = usePermission({ permission: manegementConfigsFeatureFlagCreatePermission })?.allowed;
  const deletePermission = usePermission({ permission: manegementConfigsFeatureFlagDeletePermission })?.allowed;


  const actionView = (config: Config) => ({
    icon: () => <OpenInNew fontSize="small" />,
    tooltip: 'View Details',
    onClick: () => {
      setDrawerType(DrawerType.Update);
      setOpenDrawer(true);
      setItem({ ...config });
    },
  });

  const actionDelete = (config: Config) => ({
    icon: () => <DeleteIcon fontSize="small" />,
    tooltip: 'Delete',
    onClick: () => {
      setItem({ ...config });
      setOpenDialog(true);
    },
  });

  const actions = [];
  if (createPermission) actions.push(actionView);
  if (deletePermission) actions.push(actionDelete);

  const deleteConfigWithErrorTratment = async () => {

    setLoading(true);
    setOpenDialog(false);

    try {
      await deleteConfig(item);
    } catch (e: any) {
      alertApi.post({
        message: `Error on save: ${e?.message}`,
        severity: 'error',
      });
    }

    setLoading(false);
  };

  if (loading) return <Progress />;

  return (
    <>
      <Grid container direction="column" spacing={3} data-testid="management-featureflags">
        
        {createPermission && <Grid item>
            <Grid container direction="column" alignContent='flex-end'>
              <Grid item>
                <Button
                  color='primary'
                  variant='contained'
                  onClick={() => { setOpenDrawer(true); setDrawerType(DrawerType.Create) }}>
                  Create
                </Button>
              </Grid>
            </Grid>
          </Grid>}

        <Grid item >
          <ConfigsTable
            type={type}
            configs={configs}
            actions={actions}
            title={title}
          />
        </Grid>
      </Grid>

      <ItemDrawer
        isOpen={openDrawer}
        toggleDrawer={() => setOpenDrawer(!openDrawer)}
        item={item}
        setItem={setItem}
        drawerType={drawerType}
        type={type}
      />

      <ConfirmDeletionDialog
        open={openDialog}
        handleClose={() => { setOpenDialog(false) }}
        configKey={item.key}
        type={item.type}
        handleClick={() => { deleteConfigWithErrorTratment() }}
      />
    </>
  );
};
