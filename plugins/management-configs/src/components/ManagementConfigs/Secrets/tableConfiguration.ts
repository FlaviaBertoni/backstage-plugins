import { Config } from '../../hooks/ConfigsContext';

export const tableSecretConfiguration = {

    columns: [
        { title: 'Key', field: 'key' },
        { title: 'Created On', field: 'createdOn' },
        { title: 'Updated On', field: 'updatedOn' },
    ],

    dataMap: (config: Config, index: number) => {
        return { ...config, id: index };
    }
};