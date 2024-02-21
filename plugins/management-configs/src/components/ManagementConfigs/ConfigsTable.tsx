import React from 'react';
import { Table } from '@backstage/core-components';

import { Action } from '@material-table/core';

import { Config, ConfigType } from '../hooks/ConfigsContext';
import { tableEnvConfiguration } from './Env/tableConfiguration';
import { tableFeatureFlagConfiguration } from './FeatureFlag/tableConfiguration';
import { tableSecretConfiguration } from './Secrets/tableConfiguration';

type ConfigsTableProps = {
    configs: Config[] | EnvDataTable[];
    title: string;
    type: ConfigType;
    actions?: ((config: Config) => Action<Config>)[];
};

export type EnvDataTable = {
    key: string;
    updatedOn: string;
};

export const ConfigsTable = ({ configs, title, type, actions }: ConfigsTableProps) => {

    const tableConfigs = {
        [ConfigType.Env]: tableEnvConfiguration,
        [ConfigType.FeatureFlag]: tableFeatureFlagConfiguration,
        [ConfigType.Secret]: tableSecretConfiguration,
    };
    
    const { columns, dataMap } = tableConfigs[type];
  
    const data = configs.map(dataMap);
  
    return (
        <Table
            title={title}
            columns={columns}
            data={data}
            actions={actions}
            options={{
                search: true,
                paging: false,
                actionsColumnIndex: -1,
                loadingType: 'linear',
            }}
        />
    );
  };