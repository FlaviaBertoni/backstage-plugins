import React from 'react';
import { Progress, ResponseErrorPanel } from '@backstage/core-components';

import { useConfigsContext, ConfigType } from '../hooks/ConfigsContext';
import { ManagementSecrets } from './Secrets';
import { ManagementEnvs } from './Env';
import { ManagementFeatureFlags } from './FeatureFlag';

export const ManagementConfigs = ({ title }: { title: string }) => {
  const { configs, loading, error, type } = useConfigsContext();

  if (loading) return <Progress />;
  
  if (error) return <ResponseErrorPanel error={error} />;

  if (type === ConfigType.Secret) return <ManagementSecrets configs={configs} title={title} />;
  if (type === ConfigType.Env) return <ManagementEnvs configs={configs} title={title} />;
  if (type === ConfigType.FeatureFlag) return <ManagementFeatureFlags configs={configs} title={title} />;

  return <ResponseErrorPanel error={new Error('Config type not found.')} />;
};