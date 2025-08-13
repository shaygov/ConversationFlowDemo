import authStore, { IAuthState } from "@/zustand/auth";
import { API_URL } from '@/constants/env';

const getDefaultParams = (params: any) => {
  const authorizationToken = (authStore.getState() as IAuthState).auth?.token || '';
  const body = params.body ? JSON.stringify(params.body) : null;
  const headers = {
    ...params.headers || {},
    "Content-Type": "application/json",
  };

  if (authorizationToken) {
    headers["Authorization"] = `Bearer ${authorizationToken}`;
  }

  const result = {
    ...params,
    url: `${API_URL}${params.url}`,
    headers,
  };

  if (body) {
    result.body = body;
  }

  return result;
};

// Function to process individual fetch requests
const fetchRequest = async (requestParams: any) => {
  const defaultParams = getDefaultParams(requestParams);
  const { url, ...params } = defaultParams;

  try {
    return await fetch(url, params);
  } catch (error) {
    return error;
  }
};

export default {
  get: (params: any) => fetchRequest({
    ...params,
    method: 'GET'
  }),
  post: (params: any) => fetchRequest({
    ...params,
    method: 'POST'
  }),
  delete: (params: any) => fetchRequest({
    ...params,
    method: 'DELETE'
  }),
}
