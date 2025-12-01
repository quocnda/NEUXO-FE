import axios from 'axios';

import { env } from '@/lib/const';

import { request } from '../axios';
import type {
  IBodyUpdateProfileUser,
  IChangePasswordParams,
  IChangeRole,
  ILoginParams,
  ISetPasswordParams,
  ISignupParams,
  ISignupResponse,
  IUser,
} from './types';

export const loginRequest = async (params: ILoginParams) => {
  const { data } = await request({
    url: '/user/sign_in',
    method: 'POST',
    data: params,
  });
  return data;
};

export const logoutRequest = async (): Promise<boolean> => {
  const { data } = await request({
    url: '/user/sign_out',
    method: 'POST',
  });

  return data;
};

export const refreshTokenRequest = async (refreshToken: string) => {
  const { data } = await axios.get(`${env.API_URL}/user/refresh_token_user`, {
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  return data;
};
export const getUserProfile = async (): Promise<IUser> => {
  const { data } = await request({
    url: '/user/user_infor',
    method: 'GET',
  });

  return data.data;
};

export const signUpRequest = async (params: ISignupParams) => {
  const { data } = await request({
    url: '/user/admin/crete',
    method: 'POST',
    data: params,
  });
  return data;
};

export const getListAdmin = async (): Promise<ISignupResponse[]> => {
  const { data } = await request({
    url: '/user/admin/list',
    method: 'GET',
  });

  return data.data;
};

export const changePassword = async (params: IChangePasswordParams) => {
  const { data } = await request({
    url: '/user/change_password',
    method: 'POST',
    data: params,
  });
  return data;
};

export const setPassword = async (params: ISetPasswordParams) => {
  const { data } = await request({
    url: '/user/set_password',
    method: 'POST',
    data: params,
  });
  return data;
};

export const deleteAccount = async (params: { id: string }) => {
  const { data } = await request({
    url: `/user/admin/delete/${params.id}`,
    method: 'DELETE',
  });
  return data;
};

export const changeRole = async (params: IChangeRole) => {
  const { data } = await request({
    url: `/user/admin/update/${params.id}`,
    method: 'PUT',
    data: params,
  });
  return data;
};

export const loginWithGoogle = async (params: { token_id: string }) => {
  const { data } = await request({
    url: '/user/sign_in_google',
    method: 'POST',
    data: params,
  });
  return data;
};

export const signUpWithGoogle = async (params: { token_id: string }) => {
  const { data } = await request({
    url: '/user/sign_up_google',
    method: 'POST',
    data: params,
  });
  return data;
};

export const updateProfileUser = async (params: IBodyUpdateProfileUser) => {
  const { data } = await request({
    url: '/user/update_profile',
    method: 'PUT',
    data: params,
  });
  return data;
};

export const uploadProfile = async (params: { file: File }) => {
  const { data } = await request({
    url: '/data/file/upload',
    method: 'POST',
    data: params,
  });
  return data;
};
