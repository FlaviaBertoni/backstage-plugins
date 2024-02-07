import { useApi } from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { Config, useConfigsContext } from '.';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';

export const useConfigUpdate = () => {
  const { dispatchReloadEvent, namespace, name } = useConfigsContext();
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef) ?? { fetch };

  const update = async (item: Config) => {
    const baseUrlData = await discoveryApi.getBaseUrl('management-configs');

    const { type, key, value } = item;
    const url = `${baseUrlData}/${namespace}/${name}?type=${type}`;

    const response = await fetchApi.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, value }),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    dispatchReloadEvent();
  };

  return { update };
};

export const useConfigCreate = () => {
  const { dispatchReloadEvent, namespace, name } = useConfigsContext();
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef) ?? { fetch };

  const create = async (item: Config) => {

    const baseUrlData = await discoveryApi.getBaseUrl('management-configs');

    const { type, key, value } = item;
    const url = `${baseUrlData}/${namespace}/${name}?type=${type}`;

    const response = await fetchApi.fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, value }),
    });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    dispatchReloadEvent();
  };

  return { create };
};

export const useConfigDelete = () => {
  const { dispatchReloadEvent, namespace, name } = useConfigsContext();
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef) ?? { fetch };

  const deleteConfig = async (config: Config) => {

    const baseUrlData = await discoveryApi.getBaseUrl('management-configs');

    const { type, key } = config;
    const url = `${baseUrlData}/${namespace}/${name}?type=${type}&key=${key}`;

    const response = await fetchApi.fetch(url, { method: 'DELETE' });

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    dispatchReloadEvent();
  };

  return { deleteConfig };
};

export const useConfigGet = () => {
  const { namespace, name } = useConfigsContext();
  const discoveryApi = useApi(discoveryApiRef);
  const fetchApi = useApi(fetchApiRef) ?? { fetch };

  const getConfigValue = async (item: Config) => {
    const baseUrlData = await discoveryApi.getBaseUrl('management-configs');

    const { key, type } = item;
    const url = `${baseUrlData}/${namespace}/${name}/${key}/value?type=${type}`;

    const response = await fetchApi.fetch(url);

    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    return response.text();
  };

  return { getConfigValue };
};