import React from 'react';
import { useEntity } from '@backstage/plugin-catalog-react';
import { DEFAULT_NAMESPACE } from '@backstage/catalog-model';

import { ManagementConfigs } from '../ManagementConfigs';
import { ConfigsProvider, ConfigType } from '../hooks/ConfigsContext';

export const ManagementConfigsContent = (props: { title: string, type: ConfigType }) => {
  const { entity } = useEntity();

  const namespace = entity?.metadata?.namespace || DEFAULT_NAMESPACE;
  const name = entity?.metadata?.name || '';

  return (
      <ConfigsProvider
        type={props.type}
        name={name} 
        namespace={namespace}
      >
        <ManagementConfigs title={props.title} />
      </ConfigsProvider>
  );
};
