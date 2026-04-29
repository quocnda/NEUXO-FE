import { request } from '../axios';
import type { IParamsNotification } from './types';

export const listNotification = async (params: IParamsNotification) => {
  const { data } = await request({
    url: '/data/mail/notifications',
    method: 'GET',
    params,
  });
  return data;
};

export const countNotification = async () => {
  const { data } = await request({
    url: '/data/mail/notifications/unseen_mail_count',
    method: 'GET',
  });
  return data;
};

export const toggleNotification = async (is_subscribed: boolean) => {
  const { data } = await request({
    url: '/data/mail/notifications/toggle',
    method: 'POST',
    data: { is_subscribed },
  });
  return data;
};

export const dataToggle = async () => {
  const { data } = await request({
    url: '/data/mail/notifications/is_subscribed',
    method: 'GET',
  });
  return data;
};

export const seenNotification = async (ids: string[]) => {
  const { data } = await request({
    url: '/data/mail/notifications/seen',
    method: 'PATCH',
    data: { ids },
  });
  return data;
};

export const getEmailDetailNotification = async (notificationId: string) => {
  const { data } = await request({
    url: `data/mail/notifications/email_detail?noti_id=${notificationId}`,
    method: 'GET',
  });
  return data;
};
