import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import StatusIcon from '@material-ui/icons/Brightness1';

import { Config } from '../../hooks/ConfigsContext';

export const tableFeatureFlagConfiguration = {
    
    columns: [
      { title: 'Key', field: 'key' },
      { title: 'Updated On', field: 'updatedOn' },
      { title: 'Status', field: 'columnStatus' },
    ],

    dataMap: (config: Config, index: number) => {
        const value = Boolean(config.value);
        const color = value ? 'primary' : 'disabled';
        const tootip = value ? 'enabled' : 'disabled';
        
        return { ...config, id: index, value, columnStatus: (
          <Tooltip title={tootip}>
            <StatusIcon color={color} style={{ marginLeft: '16px' }}/>
          </Tooltip>
        )};
    }
};