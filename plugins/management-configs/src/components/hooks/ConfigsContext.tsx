import React, { createContext, useState, ReactNode, useContext } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { useApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';

export enum ConfigType {
  Secret = 'secret',
  Env = 'env',
  FeatureFlag = 'featureflag',
}

export type Config = {
  key: string;
  createdOn?: string;
  updatedOn: string;
  type?: ConfigType;
  value?: string | boolean;
  columnStatus?: React.JSX.Element;
};

interface ConfigsContextProps {
  configs: Config[];
  name: string;
  namespace: string;
  loading: boolean;
  error: Error | undefined;
  type: ConfigType;
  dispatchReloadEvent: () => void;
}

interface ConfigsProviderProps {
  children: ReactNode;
  name: string;
  namespace: string;
  type: ConfigType;
}

const ConfigsContext = createContext<ConfigsContextProps>({
  configs: [],
  name: '',
  namespace: '',
  loading: false,
  error: undefined,
  type: ConfigType.Secret,
  dispatchReloadEvent: () => {}
});

export const ConfigsProvider = ({ children, name, namespace, type }: ConfigsProviderProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>();
  const [configs, setConfigs] = useState<Config[]>([]);

  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef) ?? { fetch };  

  const getConfigs = async () => {
    const baseUrlData = await discoveryApi.getBaseUrl('management-configs');

    const urlData = `${baseUrlData}/${namespace}/${name}?type=${type}`;

    const responseData = await fetchApi.fetch(urlData);
    if (!responseData.ok) {
      throw await ResponseError.fromResponse(responseData);
    }

    return await responseData.json();
  };

  const initialData = useAsync(async () => {
    const data = await getConfigs();
    setConfigs(data);
    return { data };
  }, [discoveryApi, name, type]);

  const dispatchReloadEvent = () => {
    setLoading(true);
    
    getConfigs()
      .then((data) => { setConfigs(data) })
      .catch((e: Error) => { setError(e) })
      .finally(() => { setLoading(false) });
  };

  return (
    <ConfigsContext.Provider 
      value={{ 
        configs,
        name,
        namespace,
        type,
        loading: loading || initialData.loading,
        error: error || initialData.error,
        dispatchReloadEvent 
      }}
    >
      {children}
    </ConfigsContext.Provider>
  );
};

export const useConfigsContext = () => useContext(ConfigsContext);