import React from 'react';

import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import { ResponseErrorPanel } from '@backstage/core-components';

import { Config, ConfigType } from '../hooks/ConfigsContext';
import { SecretCreateContent, SecretUpdateContent } from './Secrets';
import { EnvCreateContent, EnvUpdateContent } from './Env';
import { FeatureFlagCreateContent, FeatureFlagUpdateContent } from './FeatureFlag';

export enum DrawerType {
    Update = 'update',
    Create = 'create'
}

export type ItemDrawerProps = {
    isOpen: boolean;
    toggleDrawer: (isOpen: boolean) => void;
    item?: Config;
    setItem?: (item: Config) => void;
    drawerType: DrawerType;
    type: ConfigType
}

const useDrawerStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: '50%',
      justifyContent: 'space-between',
      padding: theme.spacing(2.5),
    },
  }),
);

const CreateContent = (props: ItemDrawerProps) => {

    if (props.type === ConfigType.Secret) return <SecretCreateContent {...props} />;
    if (props.type === ConfigType.Env) return <EnvCreateContent {...props} />;
    if (props.type === ConfigType.FeatureFlag) return <FeatureFlagCreateContent {...props} />;
  
    return <ResponseErrorPanel error={new Error('Config type not found.')} />;
};

const UpdateContent = (props: ItemDrawerProps) => {

    if (props.type === ConfigType.Secret) return <SecretUpdateContent {...props} />;
    if (props.type === ConfigType.Env) return <EnvUpdateContent {...props} />;
    if (props.type === ConfigType.FeatureFlag) return <FeatureFlagUpdateContent {...props} />;
  
    return <ResponseErrorPanel error={new Error('Config type not found.')} />;
};

export const ItemDrawer = (props: ItemDrawerProps) => {
    const { isOpen, toggleDrawer } = props;
    const classes = useDrawerStyles();

    return (
        <Drawer
            classes={{paper: classes.paper}}
            anchor="right"
            open={isOpen}
            onClose={() => toggleDrawer(false)}
        >
            {props.drawerType === DrawerType.Create
            ? <CreateContent {...props} />
            : <UpdateContent {...props} />}
        </Drawer>
    );
};
