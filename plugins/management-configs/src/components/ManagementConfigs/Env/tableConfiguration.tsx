import { Config } from '../../hooks/ConfigsContext';

export const tableEnvConfiguration = {

  columns: [
    { title: 'Key', field: 'key' },
    { title: 'Updated On', field: 'updatedOn' },
  ],

  dataMap: (config: Config, index: number) => {
      return { ...config, id: index };
  }
};