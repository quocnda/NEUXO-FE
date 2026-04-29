import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import Router from 'next/router';

import { env } from '@/lib/const';
import { useUserStore } from '@/stores';
import { ROUTE } from '@/types';

import { refreshTokenRequest } from './auth';

export const request = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});
const onRefreshToken = async () => {
  const store = useUserStore.getState();
  const refresh_token = store?.refresh_token;
  if (refresh_token) {
    try {
      const { data } = await refreshTokenRequest(refresh_token);
      store.setAccessToken(data?.access_token);
      return data?.access_token;
    } catch (e) {
      Router.replace(ROUTE.SIGN_IN);
      store.setIsLogin(false);
      store.logout();
    }
  } else {
    if (Router.pathname !== ROUTE.SIGN_IN) {
      Router.replace(ROUTE.SIGN_IN);
    }
    store.logout();
  }
  return null;
};
const handleSuccess = (res: AxiosResponse) => {
  return res;
};

const handleError = async (error: any) => {
  const originalRequest = error.config!;
  const data = error?.response as any;
  if ((data?.status === 401 || data?.data?.error === 'No token provided') && !originalRequest?._retry) {
    originalRequest._retry = true;
    const token = await onRefreshToken();
    axios.defaults.headers.Authorization = `Bearer ${token}`;
    return request(originalRequest);
  }

  return Promise.reject(data?.data?.meta || data?.data || error);
};

request.interceptors.response.use(handleSuccess, handleError);

request.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);
